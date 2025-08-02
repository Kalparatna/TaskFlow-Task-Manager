import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SessionWarning = () => {
  const { sessionExpiry, logout, refreshToken } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!sessionExpiry) return;

    const checkSessionTime = () => {
      const now = Date.now();
      const timeRemaining = sessionExpiry - now;
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeRemaining <= fiveMinutes && timeRemaining > 0) {
        setShowWarning(true);
        setTimeLeft(Math.ceil(timeRemaining / 1000 / 60)); // Convert to minutes
      } else {
        setShowWarning(false);
      }
    };

    const interval = setInterval(checkSessionTime, 30000); // Check every 30 seconds
    checkSessionTime(); // Check immediately

    return () => clearInterval(interval);
  }, [sessionExpiry]);

  const handleExtendSession = async () => {
    const success = await refreshToken();
    if (success) {
      setShowWarning(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowWarning(false);
  };

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-yellow-800">
              Session Expiring Soon
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your session will expire in {timeLeft} minute{timeLeft !== 1 ? 's' : ''}. 
              Would you like to extend it?
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleExtendSession}
                className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors duration-200 font-medium"
              >
                Extend Session
              </button>
              <button
                onClick={handleLogout}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Logout Now
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="flex-shrink-0 ml-2 text-yellow-400 hover:text-yellow-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;