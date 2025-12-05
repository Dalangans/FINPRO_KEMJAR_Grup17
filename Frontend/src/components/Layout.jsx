import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

export function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user data');
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen for custom auth events
    window.addEventListener('authChange', checkUser);
    return () => window.removeEventListener('authChange', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="nav-container">
          <button onClick={() => navigate('/')} className="nav-logo">Kemjar</button>
          
          <div className="nav-right">
            {user ? (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <div className="nav-links">
                <button onClick={() => navigate('/login')} className="nav-link-btn">Login</button>
                <button onClick={() => navigate('/register')} className="nav-link-btn">Register</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
