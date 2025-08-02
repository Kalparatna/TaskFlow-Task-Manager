import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskApi } from '../api/taskApi';
import Navbar from './Navbar';
import TaskFormModal from './TaskFormModal';
import TaskList from './TaskList';
import SessionWarning from './SessionWarning';

const AuthenticatedTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();

  // Fetch authenticated user's tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskApi.getAllTasks();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        // Token might be expired, try to refresh or logout
        logout();
      } else {
        setError('Failed to fetch your tasks');
      }
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskApi.createTask(taskData);
      setTasks(prev => [response.data, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
    }
  };

  // Update task
  const handleUpdateTask = async (id, taskData) => {
    try {
      const response = await taskApi.updateTask(id, taskData);
      setTasks(prev => prev.map(task => 
        task.id === id ? response.data : task
      ));
      setEditingTask(null);
      setError(null);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    try {
      await taskApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      throw err; // Re-throw to handle in TaskItem
    }
  };

  // Handle edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  // Handle add task
  const handleAddTask = () => {
    setEditingTask(null);
    setShowAddModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingTask(null);
  };

  // Handle form submit
  const handleFormSubmit = (formData) => {
    if (editingTask) {
      handleUpdateTask(editingTask.id, formData);
    } else {
      handleCreateTask(formData);
    }
  };

  // Calculate task stats
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Session Warning */}
      <SessionWarning />
      
      {/* Navbar */}
      <Navbar 
        onAddTask={handleAddTask}
        taskStats={taskStats}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-in">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <TaskList
          tasks={tasks}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          loading={loading}
        />

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to get productive?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first task to start organizing your work and boost your productivity.
            </p>
            <button
              onClick={handleAddTask}
              className="btn-primary inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Task
            </button>
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showAddModal}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
      />
    </div>
  );
};

export default AuthenticatedTaskManager;