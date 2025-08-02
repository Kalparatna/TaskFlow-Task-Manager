import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdate, onDelete, onEdit, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          </div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return null; // Empty state is handled in AuthenticatedTaskManager
  }

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-8">
      {pendingTasks.length > 0 && (
        <div className="animate-slide-in">
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-bold text-gray-900">
                Active Tasks
              </h2>
              <span className="ml-3 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                {pendingTasks.length}
              </span>
            </div>
          </div>
          <div className="grid gap-4">
            {pendingTasks.map((task, index) => (
              <div key={task.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-in">
                <TaskItem
                  task={task}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="animate-slide-in">
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-bold text-gray-900">
                Completed Tasks
              </h2>
              <span className="ml-3 px-3 py-1 text-sm font-medium text-green-600 bg-green-100 rounded-full">
                {completedTasks.length}
              </span>
            </div>
          </div>
          <div className="grid gap-4">
            {completedTasks.map((task, index) => (
              <div key={task.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-slide-in">
                <TaskItem
                  task={task}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;