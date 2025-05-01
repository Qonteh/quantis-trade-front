
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

// Load env variables
dotenv.config();

// Connect to database
connectDB();

// Create express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:8080', 
    'https://preview-a03ddab8--quantis-trade-front.lovable.app',
    process.env.FRONTEND_URL,
    /\.lovable\.app$/  // Allow all subdomains of lovable.app
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/trading', require('./routes/trading'));

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origins: ${process.env.FRONTEND_URL || 'https://preview-a03ddab8--quantis-trade-front.lovable.app'}`);
});
