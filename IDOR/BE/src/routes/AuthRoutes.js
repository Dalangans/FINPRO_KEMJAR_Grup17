const express = require('express');

class AuthRoutes {
  constructor(authController, verifyTokenMiddleware) {
    this.router = express.Router();
    this.authController = authController;
    this.verifyTokenMiddleware = verifyTokenMiddleware;
    this.setupRoutes();
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
        const message = err.message || 'Terjadi kesalahan pada server';

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
        const message = err.message || 'Terjadi kesalahan pada server';

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

    this.router.get('/user/:userId', this.verifyTokenMiddleware, async (req, res) => {
      try {
        const { userId } = req.params;
        const user = await this.authController.getProfile(userId);

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
    });


    
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AuthRoutes;
