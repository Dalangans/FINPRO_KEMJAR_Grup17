const { pool, query } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const baseResponse = require('../utils/baseResponse');

exports.register = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return baseResponse(res, false, 400, 'Passwords do not match', null);
  }

  try {
    // Check if email already exists using parameterized query
    const checkEmail = await query('SELECT email FROM users WHERE email = $1', [email]);
    
    if (checkEmail.rows.length > 0) {
      return baseResponse(res, false, 400, 'Email is already in use', null);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      [name, email, hashedPassword]
    );

    return baseResponse(res, true, 201, 'User registered successfully', {
      userId: result.rows[0].id
    });
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, 'Error registering user', null);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);

    if (!result || !result.rows || result.rows.length === 0) {
      return baseResponse(res, false, 401, 'Email or password is incorrect', null);
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return baseResponse(res, false, 401, 'Email or password is incorrect', null);
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    return baseResponse(res, true, 200, 'User logged in successfully', {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.log(error);
    return baseResponse(res, false, 500, 'Error logging in', null);
  }
};
