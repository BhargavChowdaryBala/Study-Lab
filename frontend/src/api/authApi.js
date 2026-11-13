import api from './axios';

export const authApi = {
  // Register a new user (Student or Instructor)
  register: async (userData) => {
    // userData: { name, email, password, role: 'STUDENT' | 'INSTRUCTOR' }
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Get all users (Authenticated)
  getAllUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Update user profile (Owner or Admin)
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user by ID (Admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get all students
  getAllStudents: async () => {
    const response = await api.get('/users/students');
    return response.data;
  },

  // Get all approved instructors
  getAllInstructors: async () => {
    const response = await api.get('/users/instructors');
    return response.data;
  },

  // Get pending instructors awaiting approval (Admin only)
  getPendingInstructors: async () => {
    const response = await api.get('/users/admin/instructors/pending');
    return response.data;
  },

  // Approve or Reject instructor (Admin only)
  // status: 'APPROVED' | 'REJECTED'
  updateInstructorStatus: async (id, status) => {
    const response = await api.put(`/users/admin/instructors/${id}/verification?status=${status}`);
    return response.data;
  },
};

