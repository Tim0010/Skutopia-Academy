const express = require("express");
const { auth } = require('../../middleware/auth-middleware');
const { checkRole } = require('../../middleware/check-role');
const {
  getCourseProgress,
  completeLesson,
  resetCourseProgress,
} = require("../../controllers/student-controller/course-progress-controller");

const router = express.Router();

// Get course progress for a specific course
router.get(
  '/:courseId/progress', 
  auth, 
  checkRole(['student']), 
  getCourseProgress
);

// Complete a specific lesson
router.post(
  '/:courseId/modules/:moduleId/lessons/:lessonId/complete', 
  auth, 
  checkRole(['student']), 
  completeLesson
);

// Reset course progress (optional)
router.post(
  '/:courseId/reset', 
  auth, 
  checkRole(['student']), 
  resetCourseProgress
);

module.exports = router;
