import api from './axios';

export const courseApi = {
  // Get all courses (Authenticated)
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  // Get single course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Create course (Instructor only, approved)
  // courseData: { title, Description, Category }
  createCourse: async (courseData) => {
    const response = await api.post('/courses/register', courseData);
    return response.data;
  },

  // Update course (Instructor owner or Admin)
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Delete course (Instructor owner or Admin)
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Get courses created by specific instructor ID
  getCoursesByInstructor: async (instructorId) => {
    const response = await api.get(`/courses/instructor/${instructorId}`);
    return response.data;
  },
};

