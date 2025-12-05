const express = require('express');

class AuthRoutes {
  constructor(authController, verifyTokenMiddleware) {
    this.router = express.Router();
    this.authController = authController;
    this.verifyTokenMiddleware = verifyTokenMiddleware;
    this.setupRoutes();
  }

  validateUserId(req, res, next) {
    const userId = req.params.userId;
    if (!userId || isNaN(userId) || parseInt(userId, 10) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    req.params.userId = parseInt(userId, 10);
    next();
  }

  setupRoutes() {

    this.router.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        const result = await this.authController.login(email, password);

        res.status(200).json({
          success: true,
          message: 'Login successful',
          data: result
        });
      } catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Server error occurred';

        res.status(statusCode).json({
          success: false,
          message
        });
      }
    });

    this.router.get('/profile', this.verifyTokenMiddleware, async (req, res) => {
      try {
        const user = await this.authController.getProfile(req.user.userId);

        res.status(200).json({
          success: true,
          message: 'Profile retrieved successfully',
          data: user
        });
      } catch (err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Server error occurred';

        res.status(statusCode).json({
          success: false,
          message
        });
      }
    });

    this.router.post('/logout', this.verifyTokenMiddleware, (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    });

    this.router.get('/user/:userId', 
      this.verifyTokenMiddleware, 
      this.validateUserId.bind(this), 
      async (req, res) => {
        try {
          const requestedUserId = req.params.userId;
          const authenticatedUserId = req.user.userId;

          if (requestedUserId !== authenticatedUserId) {
            console.log(`[SECURITY] Access denied for user ${authenticatedUserId} trying to access user ${requestedUserId}`);
            return res.status(403).json({
              success: false,
              message: 'Access denied. You can only access your own profile'
            });
          }

          const user = await this.authController.getProfile(requestedUserId);
          
          console.log(`[AUDIT] User ${authenticatedUserId} accessed their own profile`);

          res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            data: user
          });
        } catch (err) {
          const statusCode = err.statusCode || 500;
          const message = err.message || 'Server error occurred';

          res.status(statusCode).json({
            success: false,
            message
          });
        }
      }
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AuthRoutes;
