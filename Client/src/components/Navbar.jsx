import { useState } from 'react';
import UserProfile from './UserProfile';

const Navbar = ({ onAddTask, taskStats }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTask = () => {
    setShowAddForm(true);
    onAddTask();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
            </div>
          </div>

          {/* Center - Task Stats */}
          <div className="hidden md:flex items-center space-x-6">
            {taskStats && (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-gray-900">{taskStats.total}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-semibold text-gray-900">{taskStats.completed}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-gray-900">{taskStats.pending}</span>
                </div>
              </>
            )}
          </div>

          {/* Right - Actions and Profile */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAddTask}
              className="inline-flex items-center px-4 py-2 btn-primary text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </button>
            
            <UserProfile />
          </div>
        </div>

        {/* Mobile Stats */}
        {taskStats && (
          <div className="md:hidden pb-3 flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Total: {taskStats.total}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Done: {taskStats.completed}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Pending: {taskStats.pending}</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;