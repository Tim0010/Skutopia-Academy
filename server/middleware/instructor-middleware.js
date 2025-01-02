const instructorMiddleware = (req, res, next) => {
  try {
    // Check if user exists and has role of instructor
    if (!req.user || req.user.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Instructor privileges required.',
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in instructor authorization',
      error: error.message,
    });
  }
};

module.exports = instructorMiddleware;
