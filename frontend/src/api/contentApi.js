import api from './axios';

export const contentApi = {
  // Get all content items for a course (in sequence order)
  getContentByCourse: async (courseId) => {
    const response = await api.get(`/course-contents/course/${courseId}`);
    return response.data;
  },

  // Get content item by ID
  getContentById: async (id) => {
    const response = await api.get(`/course-contents/${id}`);
    return response.data;
  },

  // Add content to course (Instructor owner)
  // contentData: { contenttype: 'VIDEO' | 'PDF' | 'QUIZZ', contenturl, sequenceOrder }
  addContent: async (courseId, contentData) => {
    const response = await api.post(`/course-contents/course/${courseId}`, contentData);
    return response.data;
  },

  // Update content item (Instructor owner or Admin)
  // Backend requires id inside updatedContent
  updateContent: async (id, contentData) => {
    const payload = { ...contentData, id };
    const response = await api.put(`/course-contents/${id}`, payload);
    return response.data;
  },

  // Delete content item (Instructor owner or Admin)
  deleteContent: async (id) => {
    const response = await api.delete(`/course-contents/${id}`);
    return response.data;
  },
};

