import api from './api';

export const instructorService = {
  // Dashboard
  getDashboardData: async () => {
    const response = await api.get('/instructor/dashboard');
    return response.data;
  },

  // Course Management
  getCourseStats: async () => {
    const response = await api.get('/instructor/courses/stats');
    return response.data;
  },

  createCourse: async (courseData) => {
    const response = await api.post('/instructor/courses', courseData);
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const response = await api.put(`/instructor/courses/${courseId}`, courseData);
    return response.data;
  },

  deleteCourse: async (courseId) => {
    const response = await api.delete(`/instructor/courses/${courseId}`);
    return response.data;
  },

  // Student Progress
  getStudentProgress: async (studentId) => {
    const response = await api.get(`/instructor/students/${studentId}/progress`);
    return response.data;
  },

  gradeAssignment: async (assignmentId, gradeData) => {
    const response = await api.post(`/instructor/assignments/${assignmentId}/grade`, gradeData);
    return response.data;
  },

  // Class Scheduling
  scheduleClass: async (classData) => {
    const response = await api.post('/instructor/classes/schedule', classData);
    return response.data;
  },

  getUpcomingClasses: async () => {
    const response = await api.get('/instructor/classes/upcoming');
    return response.data;
  },
};
