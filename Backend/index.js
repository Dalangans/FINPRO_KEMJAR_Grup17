const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { pool } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
pool.connect()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error('Database connection error:', err));

// Routes
app.use('/auth', require('./routes/authRoute'));

// connect server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
