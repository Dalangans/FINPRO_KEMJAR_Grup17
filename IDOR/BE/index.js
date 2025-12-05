const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config();

const UserRepository = require('./src/repositories/UserRepository');
const AuthController = require('./src/controllers/AuthController');
const AuthRoutes = require('./src/routes/AuthRoutes');
const { createVerifyTokenMiddleware } = require('./src/middlewares/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  maxAge: 3600
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, _res, next) => { console.log(`${req.method} ${req.path}`); next(); });

const userRepository = new UserRepository();
async function seedUsers() {
  try {
    const users = [
      { username: 'nabiel13', email: 'nabiel13@gmail.com', password: 'password13' },
      { username: 'pavel10', email: 'pavel10@gmail.com', password: 'password10' },
      { username: 'dalangmod', email: 'dalangmod@gmail.com', password: 'password1310' }
    ];

    for (const user of users) {
      const existing = await userRepository.findByEmail(user.email);
      if (!existing) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await userRepository.create(user.username, user.email, hashedPassword);
      }
    }
  } catch (err) {
    console.error('Error seeding users:', err.message);
  }
}

const startServer = () => {
  if (app.locals.serverStarted) return;
  app.locals.serverStarted = true;
  app.listen(PORT, () => {
    console.log('Server running on port', PORT);
  });
};

(async () => {
  try {
    await seedUsers();
  } catch (err) {
    console.log('Failed to seed users:', err.message);
  }
  
  try {
    startServer();
  } catch (err) {
    console.error('ERROR starting server:', err);
    process.exit(1);
  }
})().catch(err => {
  console.error('FATAL ERROR in main:', err);
  process.exit(1);
});

const authController = new AuthController(userRepository, JWT_SECRET);
const verifyTokenMiddleware = createVerifyTokenMiddleware(JWT_SECRET);
const authRoutes = new AuthRoutes(authController, verifyTokenMiddleware);

app.use('/api/auth', authRoutes.getRouter());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', users: userRepository.users.size });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.use((req, res) => res.status(404).json({ message: 'Endpoint not found', path: req.path }));

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
