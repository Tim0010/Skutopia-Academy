const express = require("express");
const {
  getFeaturedCourses,
  getSuccessStories,
  getNewsUpdates,
  getStatistics,
} = require("../../controllers/public-controller");
const Course = require("../../models/Course");

const router = express.Router();

// Public routes (no authentication required)
router.get("/featured-courses", getFeaturedCourses);
router.get("/success-stories", getSuccessStories);
router.get("/news-updates", getNewsUpdates);
router.get("/statistics", getStatistics);

// Search courses endpoint
router.get("/search-courses", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "instructor.name": { $regex: query, $options: "i" } },
      ],
    })
    .select("title description instructor.name thumbnail")
    .limit(5);

    res.json(courses);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching courses" });
  }
});

module.exports = router;
