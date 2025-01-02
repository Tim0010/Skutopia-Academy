import api from './api';

export const parentService = {
  // Dashboard
  getDashboardData: async () => {
    const response = await api.get('/parent/dashboard');
    return response.data;
  },

  // Children Management
  getChildrenProgress: async () => {
    const response = await api.get('/parent/children/progress');
    return response.data;
  },

  getChildDetails: async (childId) => {
    const response = await api.get(`/parent/children/${childId}`);
    return response.data;
  },

  // Academic Performance
  getAcademicReports: async (childId) => {
    const response = await api.get(`/parent/children/${childId}/reports`);
    return response.data;
  },

  // Communication
  getTeacherMessages: async () => {
    const response = await api.get('/parent/messages');
    return response.data;
  },

  sendMessage: async (messageData) => {
    const response = await api.post('/parent/messages', messageData);
    return response.data;
  },

  // Events & Meetings
  getUpcomingEvents: async () => {
    const response = await api.get('/parent/events');
    return response.data;
  },

  scheduleParentTeacherMeeting: async (meetingData) => {
    const response = await api.post('/parent/meetings/schedule', meetingData);
    return response.data;
  },
};
