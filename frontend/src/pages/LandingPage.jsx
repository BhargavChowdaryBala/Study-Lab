import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseApi } from '../api/courseApi';
import { CourseCard } from '../components/course/CourseCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Award, 
  CheckCircle2, 
  Compass,
  PlayCircle,
  MailCheck,
  Layers
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated, isStudent, isInstructor, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is already authenticated, allow them to view landing or jump to their dashboard
    loadCourses();
  }, [isAuthenticated]);

  const loadCourses = async () => {
    try {
      if (isAuthenticated) {
        const courses = await courseApi.getAllCourses();
        setFeaturedCourses((courses || []).slice(0, 3));
      } else {
        // Fallback mockup showcase courses if not logged in
        setFeaturedCourses([
          {
            id: 1,
            title: 'Mastering Spring Boot 3 & Enterprise Microservices',
            description: 'Comprehensive guide to building production-grade REST APIs, JPA entities, and Spring Security with MySQL.',
            category: 'Backend Engineering',
            instructor: { name: 'Prof. Bhargav Chowdary', email: 'instructor@example.com' },
          },
          {
            id: 2,
            title: 'Full Stack Modern Web Development with React 18',
            description: 'Learn modern frontend design, Tailwind CSS, Axios REST integration, and responsive state architecture.',
            category: 'Frontend Development',
            instructor: { name: 'Sarah Jenkins', email: 'sarah@example.com' },
          },
          {
            id: 3,
            title: 'Cloud Architecture & DevOps Deployment',
            description: 'Deploy resilient cloud applications with Docker, Kubernetes, CI/CD pipelines, and secure cloud storage.',
            category: 'Cloud & DevOps',
            instructor: { name: 'Alex Rivera', email: 'alex@example.com' },
          },
        ]);
      }
    } catch {
      // Fallback showcase items
      setFeaturedCourses([
        {
          id: 1,
          title: 'Mastering Spring Boot 3 & Enterprise Microservices',
          description: 'Comprehensive guide to building production-grade REST APIs, JPA entities, and Spring Security with MySQL.',
          category: 'Backend Engineering',
          instructor: { name: 'Prof. Bhargav Chowdary', email: 'instructor@example.com' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-black text-slate-800 dark:text-neutral-100 transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50 dark:from-neutral-950 dark:via-black dark:to-black border-b border-slate-200/60 dark:border-neutral-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-300/30 to-indigo-300/20 dark:from-brand-600/10 dark:to-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-soft animate-fade-in">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Study Lab — Interactive Course Management System</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Accelerate Your Mastery in the{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800 dark:from-brand-400 dark:via-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Study Lab
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Study Lab is a modern full-stack learning platform featuring polymorphic video lectures, downloadable PDFs, concept check quizzes, code scratchpad, and real-time progress tracking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
            {isAuthenticated ? (
              <Link
                to={isStudent ? '/student/dashboard' : isInstructor ? '/instructor/dashboard' : '/admin/dashboard'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-elevated flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-elevated flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <span>Start Learning for Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/courses"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-800 border border-slate-300 dark:border-neutral-800 text-slate-800 dark:text-neutral-100 font-semibold text-sm shadow-soft flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <Compass className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Browse Courses</span>
                </Link>
              </>
            )}
          </div>

          {/* Feature Highlights Bar */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 dark:border-neutral-900 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">100% Free Access</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Open course catalog</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Polymorphic Content</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Video, PDF & Quizzes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <MailCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Automated Alerts</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Real-time Gmail SMTP</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Spring Security 6</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Role-Based Access Control</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="py-16 bg-white dark:bg-black border-b border-slate-200/60 dark:border-neutral-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 mb-1">
                Featured Curriculum
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Top Rated Courses Available Now
              </h2>
            </div>
            <Link
              to="/courses"
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1.5 group"
            >
              <span>View All Courses</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching course catalog..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Architecture Highlights Section for Resume Review */}
      <section className="py-16 bg-slate-900 dark:bg-neutral-950 text-white border-b border-slate-800 dark:border-neutral-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold tracking-wider uppercase border border-brand-500/30">
              System Engineering & Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-4 mb-3">
              Full-Stack Architecture & Design Principles
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Engineered with clean separation of concerns, robust database constraints, and RESTful stateless communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-soft">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Granular endpoint protection using Spring Security's <code className="text-brand-300">@PreAuthorize</code> annotations. Supports distinct workflows for Students, Instructors, and Administrators.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-soft">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Polymorphic JPA Entities</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Single-table inheritance discriminator mapping for <code className="text-brand-300">VideoContent</code>, <code className="text-brand-300">PdfContent</code>, and <code className="text-brand-300">QuizContent</code> to support rich multimedia learning.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-soft">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Automated Lifecycle Triggers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Event-driven email dispatches via Spring Mail upon student registration, course enrollment, and instructor verification approvals with instant delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Join Section */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">
            Ready to Accelerate Your Learning Journey?
          </h2>
          <p className="text-brand-100 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of ambitious students and instructors building real-world software engineering competencies today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-xs uppercase tracking-wider hover:bg-brand-50 shadow-elevated transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-800/70 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-brand-400/30"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

