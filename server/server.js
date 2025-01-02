const mongoose = require('mongoose');
const logger = require('./config/logger');
const { app } = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

// Database connection
mongoose
  .connect(MONGO_URI)
  .then(() => logger.info('MongoDB is connected'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
