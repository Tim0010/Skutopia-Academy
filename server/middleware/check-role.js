const createError = require('http-errors');

exports.checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw createError(403, 'Access forbidden: Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
