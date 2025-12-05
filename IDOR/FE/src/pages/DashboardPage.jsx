import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0e27',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        padding: '0 20px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '50px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#ffffff',
            margin: '0',
            letterSpacing: '-0.5px'
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#8892b0',
            margin: '8px 0 0 0'
          }}>
            You're signed in
          </p>
        </div>

        <div style={{
          backgroundColor: '#1a202c',
          border: '1px solid #2d3748',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                fontSize: '12px',
                color: '#8892b0',
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email
              </p>
              <p style={{
                fontSize: '16px',
                color: '#ffffff',
                margin: '0',
                fontWeight: '500'
              }}>
                {user?.email}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#a63ac7ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              ✓
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: 'transparent',
            color: '#8892b0',
            border: '1px solid #2d3748',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.3px'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#6a2590ff';
            e.target.style.color = '#ffffff';
            e.target.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#2d3748';
            e.target.style.color = '#8892b0';
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          Sign Out
        </button>

        <div style={{
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: '1px solid #2d3748',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: '0'
          }}>
            © PAVEL CUNDUY
          </p>
        </div>
      </div>
    </div>
  );
};
