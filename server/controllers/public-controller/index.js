const Course = require("../../models/Course");
const User = require("../../models/User");
const News = require("../../models/News");

// Get featured courses
const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isFeatured: true })
      .select("title description instructor price rating studentsEnrolled thumbnail category")
      .limit(6)
      .populate("instructor", "name");

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching featured courses",
      error: error.message,
    });
  }
};

// Get success stories
const getSuccessStories = async (req, res) => {
  try {
    const successStories = await User.find({ hasTestimonial: true })
      .select("name role story profileImage courseTaken")
      .limit(3)
      .populate("courseTaken", "title");

    res.status(200).json({
      success: true,
      data: successStories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching success stories",
      error: error.message,
    });
  }
};

// Get news and updates
const getNewsUpdates = async (req, res) => {
  try {
    const news = await News.find()
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching news updates",
      error: error.message,
    });
  }
};

// Get platform statistics
const getStatistics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalCourses = await Course.countDocuments();
    const successfulStudents = await User.countDocuments({ 
      role: "student", 
      coursesCompleted: { $gt: 0 } 
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalInstructors,
        totalCourses,
        successfulStudents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getFeaturedCourses,
  getSuccessStories,
  getNewsUpdates,
  getStatistics,
};
