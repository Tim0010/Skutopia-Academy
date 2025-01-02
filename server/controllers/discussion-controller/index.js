const Discussion = require("../../models/Discussion");

// Create a new discussion
const createDiscussion = async (req, res) => {
  try {
    const { courseId, lectureId, title, content } = req.body;
    const { _id: userId, userName } = req.user;

    const discussion = new Discussion({
      courseId,
      lectureId,
      userId,
      userName,
      title,
      content,
    });

    await discussion.save();

    res.status(201).json({
      success: true,
      message: "Discussion created successfully",
      data: discussion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating discussion",
      error: error.message,
    });
  }
};

// Get discussions for a lecture
const getLectureDiscussions = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const discussions = await Discussion.find({ courseId, lectureId })
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: discussions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching discussions",
      error: error.message,
    });
  }
};

// Add a reply to a discussion
const addReply = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content } = req.body;
    const { _id: userId, userName } = req.user;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.replies.push({
      userId,
      userName,
      content,
    });

    await discussion.save();

    res.status(200).json({
      success: true,
      message: "Reply added successfully",
      data: discussion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding reply",
      error: error.message,
    });
  }
};

// Toggle like on a discussion
const toggleLike = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { _id: userId } = req.user;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    const likeIndex = discussion.likes.indexOf(userId);
    if (likeIndex === -1) {
      discussion.likes.push(userId);
    } else {
      discussion.likes.splice(likeIndex, 1);
    }

    await discussion.save();

    res.status(200).json({
      success: true,
      message: "Like toggled successfully",
      data: discussion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling like",
      error: error.message,
    });
  }
};

// Toggle pin status (instructor only)
const togglePin = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { role } = req.user;

    if (role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can pin discussions",
      });
    }

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.isPinned = !discussion.isPinned;
    await discussion.save();

    res.status(200).json({
      success: true,
      message: "Pin status toggled successfully",
      data: discussion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling pin status",
      error: error.message,
    });
  }
};

// Mark discussion as resolved
const toggleResolved = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { _id: userId, role } = req.user;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Only allow the discussion creator or instructor to resolve
    if (discussion.userId.toString() !== userId && role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to resolve this discussion",
      });
    }

    discussion.isResolved = !discussion.isResolved;
    await discussion.save();

    res.status(200).json({
      success: true,
      message: "Resolution status toggled successfully",
      data: discussion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling resolution status",
      error: error.message,
    });
  }
};

// Get all discussions for a course (instructor only)
const getCourseDiscussions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { role } = req.user;

    if (role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can access course discussions",
      });
    }

    const discussions = await Discussion.find({ courseId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: discussions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching course discussions",
      error: error.message,
    });
  }
};

// Delete a discussion (instructor only)
const deleteDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { role } = req.user;

    if (role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can delete discussions",
      });
    }

    await Discussion.findByIdAndDelete(discussionId);

    res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting discussion",
      error: error.message,
    });
  }
};

// Get discussion statistics for a course (instructor only)
const getDiscussionStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { role } = req.user;

    if (role !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can access discussion statistics",
      });
    }

    const totalDiscussions = await Discussion.countDocuments({ courseId });
    const resolvedDiscussions = await Discussion.countDocuments({ 
      courseId, 
      isResolved: true 
    });
    const unresolvedDiscussions = await Discussion.countDocuments({ 
      courseId, 
      isResolved: false 
    });
    const pinnedDiscussions = await Discussion.countDocuments({ 
      courseId, 
      isPinned: true 
    });

    const mostActiveDiscussions = await Discussion.find({ courseId })
      .sort({ 'replies.length': -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalDiscussions,
        resolvedDiscussions,
        unresolvedDiscussions,
        pinnedDiscussions,
        mostActiveDiscussions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching discussion statistics",
      error: error.message,
    });
  }
};

// Flag a discussion (instructor only)
const flagDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.isFlagged = !discussion.isFlagged;
    await discussion.save();

    res.status(200).json({
      success: true,
      message: `Discussion ${discussion.isFlagged ? 'flagged' : 'unflagged'} successfully`,
      data: discussion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error flagging discussion",
      error: error.message,
    });
  }
};

module.exports = {
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
};
