import api from './axios';

export const enrollmentApi = {
  // Enroll logged-in student in a course
  enrollStudent: async (courseId) => {
    const response = await api.post(`/enrollments?courseId=${courseId}`);
    return response.data;
  },

  // Get enrollments for the currently logged-in student
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-enrollments');
    return response.data;
  },

  // Get all enrollments across system (Admin only)
  getAllEnrollments: async () => {
    const response = await api.get('/enrollments');
    return response.data;
  },

  // Get specific enrollment by ID
  getEnrollmentById: async (id) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },

  // Get enrollments for a specific student ID (Student owner or Admin)
  getByStudent: async (studentId) => {
    const response = await api.get(`/enrollments/student/${studentId}`);
    return response.data;
  },

  // Get enrollments for a specific course (Course Instructor or Admin)
  getByCourse: async (courseId) => {
    const response = await api.get(`/enrollments/course/${courseId}`);
    return response.data;
  },

  // Complete an enrollment (Student, Instructor, or Admin)
  completeEnrollment: async (id) => {
    const response = await api.put(`/enrollments/${id}/complete`);
    return response.data;
  },

  // Cancel an enrollment (Student or Admin)
  cancelEnrollment: async (id) => {
    const response = await api.put(`/enrollments/${id}/cancel`);
    return response.data;
  },
};

