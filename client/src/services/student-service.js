import api from './api';

export const studentService = {
  // Dashboard
  getDashboardData: async () => {
    const response = await api.get('/student/dashboard');
    return response.data;
  },

  // Course Management
  getEnrolledCourses: async () => {
    const response = await api.get('/student/courses');
    return response.data;
  },

  enrollInCourse: async (courseId) => {
    const response = await api.post(`/student/courses/${courseId}/enroll`);
    return response.data;
  },

  getCourseContent: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/content`);
    return response.data;
  },

  // Course Progress
  getCourseProgress: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/progress`);
    return response.data;
  },

  completeLesson: async (courseId, moduleId, lessonId) => {
    const response = await api.post(`/student/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/complete`);
    return response.data;
  },

  // Assignments
  getAssignments: async () => {
    const response = await api.get('/student/assignments');
    return response.data;
  },

  submitAssignment: async (assignmentId, submissionData) => {
    const response = await api.post(`/student/assignments/${assignmentId}/submit`, submissionData);
    return response.data;
  },

  // Progress Tracking
  getProgress: async () => {
    const response = await api.get('/student/progress');
    return response.data;
  },

  // Study Materials
  getStudyMaterials: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/materials`);
    return response.data;
  },

  // Discussion Forums
  getForumPosts: async (courseId) => {
    const response = await api.get(`/student/courses/${courseId}/forum`);
    return response.data;
  },

  createForumPost: async (courseId, postData) => {
    const response = await api.post(`/student/courses/${courseId}/forum`, postData);
    return response.data;
  },

  // Assessments
  getAssessments: async () => {
    const response = await api.get('/student/assessments');
    return response.data;
  },

  submitAssessment: async (assessmentId, answers) => {
    const response = await api.post(`/student/assessments/${assessmentId}/submit`, answers);
    return response.data;
  },

  // Learning Hub
  getLearningResources: async ({ type = 'all', query = '' } = {}) => {
    const response = await api.get('/student/learning/resources', {
      params: { type, query },
    });
    return response.data;
  },

  getLearningResourceById: async (resourceId) => {
    const response = await api.get(`/student/learning/resources/${resourceId}`);
    return response.data;
  },

  toggleResourceBookmark: async (resourceId) => {
    const response = await api.post(`/student/learning/resources/${resourceId}/bookmark`);
    return response.data;
  },
};
