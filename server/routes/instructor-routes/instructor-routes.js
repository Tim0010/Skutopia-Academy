const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/auth-middleware');
const { 
  getCourseStats,
  createCourse,
  updateCourse,
  deleteCourse,
  getStudentProgress,
  gradeAssignment,
  getInstructorDashboard,
  scheduleClass,
  getUpcomingClasses
} = require('../../controllers/instructor-controller');

// Dashboard Routes
router.get('/dashboard', authenticateToken, getInstructorDashboard);

// Course Management Routes
router.get('/courses/stats', authenticateToken, getCourseStats);
router.post('/courses', authenticateToken, createCourse);
router.put('/courses/:id', authenticateToken, updateCourse);
router.delete('/courses/:id', authenticateToken, deleteCourse);

// Student Progress Routes
router.get('/students/:id/progress', authenticateToken, getStudentProgress);
router.post('/assignments/:id/grade', authenticateToken, gradeAssignment);

// Class Scheduling Routes
router.post('/classes/schedule', authenticateToken, scheduleClass);
router.get('/classes/upcoming', authenticateToken, getUpcomingClasses);

module.exports = router;
