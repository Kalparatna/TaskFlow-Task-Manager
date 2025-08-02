import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AuthenticatedTaskManager from './components/AuthenticatedTaskManager';

// Login/Register Screen Component
function AuthScreen() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Floating shapes for visual interest */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 opacity-10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300 opacity-10 rounded-full blur-xl"></div>
      
      <div className="relative z-10 max-w-sm w-full mx-4 animate-slide-in my-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white bg-opacity-20 rounded-full mb-3 backdrop-blur-sm">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">TaskFlow</h1>
          <p className="text-blue-100 text-sm">Your personal productivity companion</p>
        </div>

        <div className="glass rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex bg-gray-100 rounded-t-2xl p-1 m-4 mb-0">
            <button
              onClick={() => setShowLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-md transition-all duration-200 ${
                showLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-md transition-all duration-200 ${
                !showLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className={`p-5 pt-3 flex flex-col ${showLogin ? 'min-h-[280px]' : 'min-h-[400px]'}`}>
            <div className="animate-fade-in flex-1">
              {showLogin ? (
                <LoginForm
                  onClose={() => {}}
                  onSwitchToRegister={() => setShowLogin(false)}
                  embedded={true}
                />
              ) : (
                <RegisterForm
                  onClose={() => {}}
                  onSwitchToLogin={() => setShowLogin(true)}
                  embedded={true}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 text-center text-xs text-blue-100">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure & Private
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Easy to Use
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function AppContent() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        
        <div className="relative z-10 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-white border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">TaskFlow</h2>
          <p className="text-blue-100">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedTaskManager /> : <AuthScreen />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
