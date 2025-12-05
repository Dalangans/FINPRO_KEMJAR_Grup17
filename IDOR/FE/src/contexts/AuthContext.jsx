import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const AUTO_LOGOUT_TIME = 5 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      const loginTime = localStorage.getItem('loginTime');
      if (!loginTime) {
        localStorage.setItem('loginTime', Date.now().toString());
      }

      const setupTimer = () => {
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
        }

        logoutTimerRef.current = setTimeout(() => {
          logout();
        }, AUTO_LOGOUT_TIME);
      };

      setupTimer();

      return () => {
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
        }
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          if (response.data.success) {
            setToken(storedToken);
            setUser(response.data.data);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('loginTime');
          }
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('loginTime');
        }
      }
      
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token: newToken, user: userData } = response.data.data;
        localStorage.setItem('loginTime', Date.now().toString());
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: response.data.data };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      error,
      isAuthenticated,
      isInitialized,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
