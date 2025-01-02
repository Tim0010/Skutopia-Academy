const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth-middleware');
const { checkRole } = require('../../middleware/check-role');
const learningResourceController = require('../../controllers/learning-resource-controller');

// Get all learning resources
router.get(
  '/resources',
  auth,
  checkRole(['student']),
  learningResourceController.getLearningResources
);

// Get a specific learning resource
router.get(
  '/resources/:id',
  auth,
  checkRole(['student']),
  learningResourceController.getLearningResourceById
);

// Toggle bookmark on a resource
router.post(
  '/resources/:id/bookmark',
  auth,
  checkRole(['student']),
  learningResourceController.toggleBookmark
);

module.exports = router;
