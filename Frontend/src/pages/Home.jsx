import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  if (user) {
    return (
      <div className="home">
        <div className="home-container">
          <div className="home-content">
            <h1>Welcome, {user.name}!</h1>
            <p>You are logged in</p>
            <div className="user-details">
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-content">
          <h1>Kemjar</h1>
          <p>Your secure authentication platform</p>
          <div className="button-group">
            <button onClick={() => navigate('/login')} className="btn btn-primary">Login</button>
            <button onClick={() => navigate('/register')} className="btn btn-secondary">Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}
