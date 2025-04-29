
const { sequelize } = require('../config/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function initDb() {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@quantisfx.com',
      countryCode: '+1',
      phone: '1234567890',
      password: 'Admin123!',
      role: 'admin',
      isVerified: true
    });

    console.log('Admin user created with email: admin@quantisfx.com and password: Admin123!');
    
    // Create test user
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      countryCode: '+1',
      phone: '9876543210',
      password: 'Test123!',
      role: 'user',
      isVerified: true,
      walletBalance: 1000,
      demoBalance: 10000
    });
    
    console.log('Test user created with email: test@example.com and password: Test123!');

    // Create some sample transactions
    await Transaction.create({
      userId: user.id,
      type: 'deposit',
      amount: 500,
      status: 'completed',
      reference: 'DEP-123456'
    });
    
    await Transaction.create({
      userId: user.id,
      type: 'deposit',
      amount: 500,
      status: 'completed',
      reference: 'DEP-789012'
    });

    console.log('Sample transactions created');
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await sequelize.close();
  }
}

initDb();
