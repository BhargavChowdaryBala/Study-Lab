import api from './axios';

export const notificationApi = {
  // Get notifications sent to the logged-in user
  getMyNotifications: async () => {
    const response = await api.get('/notifications/my');
    return response.data;
  },

  // Get all sent notification history (Admin only)
  getAllNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Send custom email (Admin only)
  sendCustomEmail: async (toEmail, subject, body) => {
    const response = await api.post('/notifications/send', null, {
      params: { toEmail, subject, body },
    });
    return response.data;
  },
};

