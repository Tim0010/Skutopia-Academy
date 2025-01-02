const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./config/logger');
const errorHandler = require('./middleware/error-handler');
const rateLimiter = require('./middleware/rate-limiter');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(rateLimiter);
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Basic Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
// For testing, we'll only include auth routes for now
app.use('/api/auth', require('./routes/auth-routes'));

// 404 handler
app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

// Error handling
app.use(errorHandler);

// Export the app without starting the server
module.exports = { app };
