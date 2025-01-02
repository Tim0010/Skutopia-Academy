const mongoose = require('mongoose');

// Validate MongoDB ObjectId
exports.validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate email format
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
exports.validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Validate phone number
exports.validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// Sanitize text input
exports.sanitizeText = (text) => {
  return text.trim().replace(/[<>]/g, '');
};

// Validate date format
exports.validateDate = (date) => {
  return !isNaN(Date.parse(date));
};

// Validate URL format
exports.validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
