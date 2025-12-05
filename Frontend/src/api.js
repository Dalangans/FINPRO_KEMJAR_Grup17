const API_BASE_URL = 'http://localhost:3000';

// Helper function to validate responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const data = await response.json();
    return {
      success: false,
      message: data.message || `HTTP ${response.status}`,
      payload: null,
    };
  }
  return await response.json();
};

export const api = {
  auth: {
    register: async (name, email, password, passwordConfirm) => {
      // SECURE: Validate inputs on client-side before sending
      if (!name || !email || !password || !passwordConfirm) {
        return {
          success: false,
          message: 'All fields are required',
          payload: null,
        };
      }

      if (password !== passwordConfirm) {
        return {
          success: false,
          message: 'Passwords do not match',
          payload: null,
        };
      }

      // SECURE: Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Invalid email format',
          payload: null,
        };
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            passwordConfirm,
          }),
        });

        return await handleResponse(response);
      } catch (error) {
        return {
          success: false,
          message: `Error: ${error.message}`,
          payload: null,
        };
      }
    },

    login: async (email, password) => {
      // SECURE: Validate inputs on client-side before sending
      if (!email || !password) {
        return {
          success: false,
          message: 'Email and password are required',
          payload: null,
        };
      }

      // SECURE: Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Invalid email format',
          payload: null,
        };
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        return await handleResponse(response);
      } catch (error) {
        console.error('Login error:', error);
        return {
          success: false,
          message: `Error: ${error.message}`,
          payload: null,
        };
      }
    },
  },

  // Add other API methods here as needed
  getWithAuth: async (endpoint) => {
    const token = localStorage.getItem('token');
    
    // SECURE: Check if token exists
    if (!token) {
      return {
        success: false,
        message: 'Authentication required',
        payload: null,
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`,
        payload: null,
      };
    }
  },
};
