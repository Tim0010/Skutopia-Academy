const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'instructor', 'parent', 'admin'],
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String
  },
  courseProgress: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson'
    }],
    startDate: {
      type: Date,
      default: Date.now
    },
    lastActivityDate: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarkedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningResource'
  }],
  preferences: {
    language: String,
    notifications: {
      email: Boolean,
      sms: Boolean
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update last activity on save
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
