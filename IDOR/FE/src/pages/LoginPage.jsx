import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
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
        maxWidth: '420px',
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
            Welcome
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#8892b0',
            margin: '8px 0 0 0'
          }}>
            Sign in to continue
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fecaca',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            fontSize: '13px',
            lineHeight: '1.5'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#1a202c',
                border: '1px solid #2d3748',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#ffffff',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#5c1d77ff';
                e.target.style.backgroundColor = '#511554ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2d3748';
                e.target.style.backgroundColor = '#1a202c';
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#1a202c',
                border: '1px solid #2d3748',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#ffffff',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#5c1d77ff';
                e.target.style.backgroundColor = '#511554ff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2d3748';
                e.target.style.backgroundColor = '#1a202c';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: isLoading ? '#4b5563' : '#43134fff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              letterSpacing: '0.3px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#962691ff';
            }}
            onMouseLeave={(e) => {
              if (!isLoading) e.target.style.backgroundColor = '#861c77ff';
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

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
