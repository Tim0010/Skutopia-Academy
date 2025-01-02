const express = require("express");
const {
  createDiscussion,
  getLectureDiscussions,
  addReply,
  toggleLike,
  togglePin,
  toggleResolved,
  getCourseDiscussions,
  deleteDiscussion,
  getDiscussionStats,
  flagDiscussion,
} = require("../../controllers/discussion-controller");
const authenticateMiddleware = require("../../middleware/auth-middleware");
const instructorMiddleware = require("../../middleware/instructor-middleware");

const router = express.Router();

// All routes require authentication
router.use(authenticateMiddleware);

// Student and Instructor routes
router.post("/", createDiscussion);
router.get("/:courseId/:lectureId", getLectureDiscussions);
router.post("/:discussionId/reply", addReply);
router.post("/:discussionId/like", toggleLike);

// Instructor-only routes
router.use(instructorMiddleware); // Add instructor middleware for remaining routes
router.get("/course/:courseId", getCourseDiscussions);
router.delete("/:discussionId", deleteDiscussion);
router.get("/stats/:courseId", getDiscussionStats);
router.patch("/:discussionId/pin", togglePin);
router.patch("/:discussionId/resolve", toggleResolved);
router.patch("/:discussionId/flag", flagDiscussion);

module.exports = router;
