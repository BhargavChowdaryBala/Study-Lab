import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Helper to encode basic auth
  const encodeCredentials = (email, password) => {
    return btoa(`${email}:${password}`);
  };

  // Login function
  const login = async (email, password) => {
    const trimmedEmail = email.trim();
    const encoded = encodeCredentials(trimmedEmail, password);

    // Save credentials so the interceptor uses them for the validation request
    localStorage.setItem('auth_credentials', encoded);

    try {
      // Validate credentials by fetching all users or testing authenticated endpoint
      const users = await authApi.getAllUsers();
      const currentUser = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (!currentUser) {
        throw new Error('User account not found in system database.');
      }

      setUser(currentUser);
      localStorage.setItem('auth_user', JSON.stringify(currentUser));
      return currentUser;
    } catch (err) {
      // Clean up failed credentials
      localStorage.removeItem('auth_credentials');
      localStorage.removeItem('auth_user');
      setUser(null);
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    // userData: { name, email, password, role }
    const registeredUser = await authApi.register(userData);
    return registeredUser;
  };

  // Refresh user data from server (useful to check approval status updates)
  const refreshUser = useCallback(async () => {
    if (!user) return null;
    try {
      const updatedUser = await authApi.getUserById(user.id);
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.warn('Could not refresh user profile:', err);
      return user;
    }
  }, [user]);

  // Logout function
  const logout = () => {
    localStorage.removeItem('auth_credentials');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  useEffect(() => {
    // Check if initial credentials exist
    const credentials = localStorage.getItem('auth_credentials');
    if (credentials && user) {
      // Silently refresh in background
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const isStudent = user?.role === 'STUDENT';
  const isInstructor = user?.role === 'INSTRUCTOR';
  const isAdmin = user?.role === 'ADMIN';
  const isApprovedInstructor = isInstructor && user?.verificationStatus === 'APPROVED';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        isStudent,
        isInstructor,
        isAdmin,
        isApprovedInstructor,
        login,
        register,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

