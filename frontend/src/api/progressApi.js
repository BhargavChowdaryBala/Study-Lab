import api from './axios';

export const progressApi = {
  // Mark a specific lesson/content as completed
  markContentComplete: async (enrollmentId, contentId) => {
    const response = await api.post(`/learning-progress/enrollment/${enrollmentId}/content/${contentId}/complete`);
    return response.data;
  },

  // Mark a lesson/content as incomplete (undo completion)
  markContentIncomplete: async (enrollmentId, contentId) => {
    const response = await api.post(`/learning-progress/enrollment/${enrollmentId}/content/${contentId}/incomplete`);
    return response.data;
  },

  // Get all progress records for an enrollment
  getProgressByEnrollment: async (enrollmentId) => {
    const response = await api.get(`/learning-progress/enrollment/${enrollmentId}`);
    return response.data;
  },

  // Get progress percentage and summary for an enrollment
  getProgressSummary: async (enrollmentId) => {
    const response = await api.get(`/learning-progress/enrollment/${enrollmentId}/summary`);
    return response.data;
  },

  // Get logged-in student's progress summary for a course directly
  getMyProgressForCourse: async (courseId) => {
    const response = await api.get(`/learning-progress/course/${courseId}/my-summary`);
    return response.data;
  },
};

