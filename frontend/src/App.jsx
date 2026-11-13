import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingThemeToggle } from './components/common/FloatingThemeToggle';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CoursesCatalogPage } from './pages/CoursesCatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CourseLearnPage } from './pages/CourseLearnPage';
import { StudyLabRedirectPage } from './pages/student/StudyLabRedirectPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { InstructorCourseManager } from './pages/instructor/InstructorCourseManager';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { NotFoundPage } from './pages/NotFoundPage';

// Layout wrapper that conditionally hides standard Navbar/Footer for the immersive classroom view
const Layout = ({ children }) => {
  const location = useLocation();
  const isClassroom = location.pathname.startsWith('/learn/course/') || location.pathname === '/studylab';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black text-slate-800 dark:text-neutral-100 transition-colors duration-200">
      {!isClassroom && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isClassroom && <Footer />}
      {!isClassroom && <FloatingThemeToggle />}
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/courses" element={<CoursesCatalogPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />

              {/* Learning Classroom & Study Lab */}
              <Route path="/learn/course/:courseId" element={<CourseLearnPage />} />
              <Route path="/studylab" element={<StudyLabRedirectPage />} />

              {/* Student Portal */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />

              {/* Instructor Portal */}
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/course/:id" element={<InstructorCourseManager />} />

              {/* Admin Portal */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </Router>
);
};

export default App;

