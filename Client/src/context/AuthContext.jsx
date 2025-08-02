import { createContext, useContext, useState, useEffect } from 'react';
import { taskApi } from '../api/taskApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Storage utility functions for secure session management
const storage = {
  // Use sessionStorage instead of localStorage for session-only persistence
  setItem: (key, value) => {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to store session data:', error);
    }
  },

  getItem: (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove session data:', error);
    }
  },

  clear: () => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  // Session timeout (30 minutes of inactivity)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Check if session is expired
  const isSessionExpired = () => {
    const expiry = storage.getItem('session_expiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry);
  };

  // Update session expiry
  const updateSessionExpiry = () => {
    const newExpiry = Date.now() + SESSION_TIMEOUT;
    storage.setItem('session_expiry', newExpiry.toString());
    setSessionExpiry(newExpiry);
  };

  // Clear all session data
  const clearSession = () => {
    storage.removeItem('access_token');
    storage.removeItem('refresh_token');
    storage.removeItem('user');
    storage.removeItem('session_expiry');
    setToken(null);
    setUser(null);
    setSessionExpiry(null);
    delete taskApi.defaults.headers.common['Authorization'];
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = storage.getItem('access_token');
      const storedUser = storage.getItem('user');

      // Check if session exists and is not expired
      if (storedToken && storedUser && !isSessionExpired()) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        taskApi.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        updateSessionExpiry(); // Extend session on app load
      } else {
        // Clear expired session
        clearSession();
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Auto-logout on session expiry
  useEffect(() => {
    if (!sessionExpiry) return;

    const checkSessionExpiry = () => {
      if (isSessionExpired()) {
        console.log('Session expired, logging out...');
        logout();
      }
    };

    const interval = setInterval(checkSessionExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // Track user activity to extend session
  useEffect(() => {
    if (!token) return;

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleUserActivity = () => {
      if (token && !isSessionExpired()) {
        updateSessionExpiry();
      }
    };

    // Add event listeners for user activity
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      // Cleanup event listeners
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [token]);

  const login = async (username, password) => {
    try {
      // Clear any existing session before new login (extra security)
      clearSession();
      
      const response = await taskApi.post('/auth/login/', { username, password });
      const { access, refresh } = response.data;

      // Store tokens in sessionStorage only (secure, session-based)
      storage.setItem('access_token', access);
      storage.setItem('refresh_token', refresh);
      storage.setItem('user', JSON.stringify({ username }));

      // Set session expiry (30 minutes)
      updateSessionExpiry();

      // Set state
      setToken(access);
      setUser({ username });

      // Set default authorization header
      taskApi.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      await taskApi.post('/auth/register/', userData);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data || 'Registration failed'
      };
    }
  };

  const logout = () => {
    console.log('Logging out user...');
    clearSession();
  };

  const refreshToken = async () => {
    try {
      const refresh = storage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token');

      const response = await taskApi.post('/auth/refresh/', { refresh });
      const { access } = response.data;

      storage.setItem('access_token', access);
      setToken(access);
      taskApi.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      updateSessionExpiry(); // Extend session on token refresh

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!token,
    sessionExpiry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};