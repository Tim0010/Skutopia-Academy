const Course = require('../../models/Course');
const User = require('../../models/User');
const createError = require('http-errors');
const { validateObjectId } = require('../../utils/validation');

exports.getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Validate course ID
    if (!validateObjectId(courseId)) {
      throw createError(400, 'Invalid course ID');
    }

    // Find the course with populated modules and lessons
    const course = await Course.findById(courseId)
      .populate({
        path: 'modules',
        populate: {
          path: 'lessons',
          select: 'title duration'
        }
      })
      .lean();

    if (!course) {
      throw createError(404, 'Course not found');
    }

    // Find user's progress for this course
    const userProgress = await User.findById(userId, {
      'courseProgress': { $elemMatch: { course: courseId } }
    }).lean();

    // Map lessons to include completion status
    const courseWithProgress = {
      ...course,
      instructor: course.instructor.name,
      modules: course.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => ({
          ...lesson,
          completed: userProgress?.courseProgress?.[0]?.completedLessons?.includes(lesson._id) || false
        })),
        completed: module.lessons.every(lesson => 
          userProgress?.courseProgress?.[0]?.completedLessons?.includes(lesson._id)
        )
      })),
      progress: calculateCourseProgress(course.modules, userProgress?.courseProgress?.[0]?.completedLessons || [])
    };

    res.json(courseWithProgress);
  } catch (error) {
    next(error);
  }
};

exports.completeLesson = async (req, res, next) => {
  try {
    const { courseId, moduleId, lessonId } = req.params;
    const userId = req.user.id;

    // Validate IDs
    if (!validateObjectId(courseId) || 
        !validateObjectId(moduleId) || 
        !validateObjectId(lessonId)) {
      throw createError(400, 'Invalid IDs');
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      throw createError(404, 'Course not found');
    }

    // Update user's progress
    const updateResult = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          'courseProgress.$[courseElem].completedLessons': lessonId
        }
      },
      {
        arrayFilters: [{ 'courseElem.course': courseId }],
        new: true,
        upsert: true
      }
    );

    // If no course progress exists, create it
    if (!updateResult) {
      await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courseProgress: {
              course: courseId,
              completedLessons: [lessonId]
            }
          }
        }
      );
    }

    res.json({ 
      message: 'Lesson completed successfully',
      lessonId 
    });
  } catch (error) {
    next(error);
  }
};

exports.resetCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Validate course ID
    if (!validateObjectId(courseId)) {
      throw createError(400, 'Invalid course ID');
    }

    // Remove course progress for this specific course
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { 
          courseProgress: { course: courseId } 
        }
      }
    );

    res.json({ 
      message: 'Course progress reset successfully',
      courseId 
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate course progress
function calculateCourseProgress(modules, completedLessons) {
  const totalLessons = modules.reduce(
    (acc, module) => acc + module.lessons.length, 
    0
  );
  const completedLessonCount = completedLessons.length;
  
  return Math.round((completedLessonCount / totalLessons) * 100);
}

module.exports = {
  getCourseProgress: exports.getCourseProgress,
  completeLesson: exports.completeLesson,
  resetCourseProgress: exports.resetCourseProgress
};
