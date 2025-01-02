const LearningResource = require('../models/learning-resource');
const { validateObjectId } = require('../utils/validation');
const createError = require('http-errors');

exports.getLearningResources = async (req, res, next) => {
  try {
    const { type, query, subject, grade } = req.query;
    const filter = {};

    // Apply filters
    if (type && type !== 'all') {
      filter.type = type;
    }
    if (subject) {
      filter.subject = subject;
    }
    if (grade) {
      filter.grade = grade;
    }
    if (query) {
      filter.$text = { $search: query };
    }

    const resources = await LearningResource.find(filter)
      .populate('subject', 'name')
      .populate('createdBy', 'name')
      .sort('-createdAt')
      .lean();

    // Add bookmarked status for the current user
    const resourcesWithBookmarkStatus = resources.map(resource => ({
      ...resource,
      bookmarked: resource.bookmarkedBy.includes(req.user.id),
    }));

    res.json(resourcesWithBookmarkStatus);
  } catch (error) {
    next(error);
  }
};

exports.getLearningResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw createError(400, 'Invalid resource ID');
    }

    const resource = await LearningResource.findById(id)
      .populate('subject', 'name')
      .populate('createdBy', 'name')
      .lean();

    if (!resource) {
      throw createError(404, 'Resource not found');
    }

    // Add bookmarked status
    resource.bookmarked = resource.bookmarkedBy.includes(req.user.id);

    res.json(resource);
  } catch (error) {
    next(error);
  }
};

exports.createLearningResource = async (req, res, next) => {
  try {
    const { title, description, type, url, subject, grade, tags } = req.body;

    const resource = new LearningResource({
      title,
      description,
      type,
      url,
      subject,
      grade,
      tags,
      createdBy: req.user.id,
    });

    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

exports.updateLearningResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!validateObjectId(id)) {
      throw createError(400, 'Invalid resource ID');
    }

    const resource = await LearningResource.findById(id);

    if (!resource) {
      throw createError(404, 'Resource not found');
    }

    // Check if user is the creator
    if (resource.createdBy.toString() !== req.user.id) {
      throw createError(403, 'Not authorized to update this resource');
    }

    Object.assign(resource, updates);
    await resource.save();

    res.json(resource);
  } catch (error) {
    next(error);
  }
};

exports.deleteLearningResource = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw createError(400, 'Invalid resource ID');
    }

    const resource = await LearningResource.findById(id);

    if (!resource) {
      throw createError(404, 'Resource not found');
    }

    // Check if user is the creator
    if (resource.createdBy.toString() !== req.user.id) {
      throw createError(403, 'Not authorized to delete this resource');
    }

    await resource.remove();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.toggleBookmark = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw createError(400, 'Invalid resource ID');
    }

    const resource = await LearningResource.findById(id);

    if (!resource) {
      throw createError(404, 'Resource not found');
    }

    const bookmarkIndex = resource.bookmarkedBy.indexOf(req.user.id);
    
    if (bookmarkIndex === -1) {
      resource.bookmarkedBy.push(req.user.id);
    } else {
      resource.bookmarkedBy.splice(bookmarkIndex, 1);
    }

    await resource.save();
    res.json({ bookmarked: bookmarkIndex === -1 });
  } catch (error) {
    next(error);
  }
};
