const Course = require('../models/course-model');
const Student = require('../models/student-model');
const Assignment = require('../models/assignment-model');
const Class = require('../models/class-model');

// Get Instructor Dashboard Data
exports.getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Get courses taught by the instructor
    const courses = await Course.find({ instructor: instructorId })
      .select('title studentsEnrolled rating progress lastUpdated')
      .populate('studentsEnrolled', 'firstName lastName');

    // Calculate total students
    const totalStudents = courses.reduce((acc, course) => 
      acc + course.studentsEnrolled.length, 0
    );

    // Calculate average rating
    const totalRating = courses.reduce((acc, course) => acc + course.rating, 0);
    const averageRating = courses.length > 0 ? totalRating / courses.length : 0;

    // Get recent activities
    const recentActivities = await Activity.find({ instructor: instructorId })
      .sort('-createdAt')
      .limit(5);

    // Get upcoming tasks
    const upcomingTasks = await Assignment.find({
      instructor: instructorId,
      dueDate: { $gte: new Date() }
    })
    .sort('dueDate')
    .limit(5);

    res.json({
      courses,
      stats: {
        totalStudents,
        activeCourses: courses.length,
        averageRating,
        completionRate: 92 // This should be calculated based on actual data
      },
      recentActivities,
      upcomingTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Course Statistics
exports.getCourseStats = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courseStats = await Course.aggregate([
      { $match: { instructor: instructorId } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: { $size: "$studentsEnrolled" } },
          averageRating: { $avg: "$rating" },
          totalCourses: { $sum: 1 }
        }
      }
    ]);

    res.json(courseStats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create New Course
exports.createCourse = async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user.id
    });
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user.id },
      req.body,
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      instructor: req.user.id
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Student Progress
exports.getStudentProgress = async (req, res) => {
  try {
    const studentId = req.params.id;
    const instructorId = req.user.id;

    const progress = await Course.find({
      instructor: instructorId,
      studentsEnrolled: studentId
    })
    .populate('assignments.submissions');

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Grade Assignment
exports.gradeAssignment = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, instructor: req.user.id },
      { grade, feedback, gradedAt: new Date() },
      { new: true }
    );
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Schedule Class
exports.scheduleClass = async (req, res) => {
  try {
    const classSession = new Class({
      ...req.body,
      instructor: req.user.id
    });
    const newClass = await classSession.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Upcoming Classes
exports.getUpcomingClasses = async (req, res) => {
  try {
    const classes = await Class.find({
      instructor: req.user.id,
      startTime: { $gte: new Date() }
    })
    .sort('startTime')
    .populate('course', 'title');
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
