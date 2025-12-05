const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  constructor(userRepository, jwtSecret) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
  }

  generateToken(userId, email) {
    return jwt.sign(
      { userId, email },
      this.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  async login(email, password) {
    if (!email || !password) {
      throw {
        statusCode: 400,
        message: 'Email and password must be filled'
      };
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw {
        statusCode: 401,
        message: 'Email or password is incorrect'
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw {
        statusCode: 401,
        message: 'Email or password is incorrect'
      };
    }

    const token = this.generateToken(user.userId, user.email);

    return {
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email
      }
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      throw {
        statusCode: 401,
        message: 'Token is invalid or expired'
      };
    }
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw {
        statusCode: 404,
        message: 'User not found'
      };
    }

    return {
      userId: user.userId,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  async getAllUsers() {
    const allUsers = await this.userRepository.getAll();
    
    return allUsers.map(user => ({
      userId: user.userId,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }));
  }
}

module.exports = AuthController;
