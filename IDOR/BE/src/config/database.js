const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI tidak ditemukan di .env');
    }

    // Set timeout lebih singkat untuk testing
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log('✓ MongoDB connected successfully');
    console.log(`  Database: ${mongoose.connection.db.getName()}`);
    console.log(`  Host: ${mongoose.connection.host}`);

    return mongoose.connection;
  } catch (err) {
    console.error('⚠️  MongoDB connection error:', err.message);
    console.log('📝 Falling back to in-memory storage...');
    
    // Return null untuk signal bahwa perlu fallback
    return null;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (err) {
    console.error('✗ MongoDB disconnect error:', err.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
