import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseApi } from '../api/courseApi';
import { contentApi } from '../api/contentApi';
import { enrollmentApi } from '../api/enrollmentApi';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  BookOpen, 
  User, 
  ArrowLeft, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isStudent, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourseDetails();
  }, [id, isAuthenticated]);

  const loadCourseDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated) {
        const courseData = await courseApi.getCourseById(id);
        setCourse(courseData);

        // Fetch curriculum content
        try {
          const contentsData = await contentApi.getContentByCourse(id);
          setContents(contentsData || []);
        } catch {
          setContents([]);
        }

        // Check enrollment
        if (isStudent) {
          const myEnrollments = await enrollmentApi.getMyEnrollments();
          const enrolled = (myEnrollments || []).some((e) => e.course?.id === Number(id));
          setIsEnrolled(enrolled);
        }
      } else {
        // Fallback for public preview
        setCourse({
          id: Number(id),
          title: 'Mastering Spring Boot 3 & Enterprise Microservices',
          description: 'A comprehensive, end-to-end curriculum covering Spring Security 6, BCrypt password hashing, JPA relationship mappings, MySQL, and REST API best practices.',
          category: 'Java & Spring Boot',
          instructor: { id: 1, name: 'Prof. Bhargav Chowdary', email: 'instructor@example.com' },
        });
        setContents([
          { id: 101, contenttype: 'VIDEO', contenturl: 'https://www.youtube.com/watch?v=9SGDpanrc8U', sequenceOrder: 1 },
          { id: 102, contenttype: 'PDF', contenturl: 'https://example.com/lecture-1-slides.pdf', sequenceOrder: 2 },
          { id: 103, contenttype: 'QUIZZ', contenturl: 'Spring Security Basic Concepts', sequenceOrder: 3 },
        ]);
      }
    } catch (err) {
      setError(err.message || 'Could not load course details.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in as a student to enroll.', 'info');
      navigate('/login');
      return;
    }

    if (!isStudent) {
      showToast('Only student accounts can enroll in courses.', 'warning');
      return;
    }

    setEnrolling(true);
    try {
      await enrollmentApi.enrollStudent(id);
      setIsEnrolled(true);
      showToast('Enrollment successful! Email confirmation dispatched.', 'success');
    } catch (err) {
      showToast(err.message || 'Enrollment failed.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingSpinner size="lg" text="Loading course syllabus..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-soft">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">Course Not Available</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {error || 'The requested course does not exist or has been removed.'}
          </p>
          <Link
            to="/courses"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id && course.instructor?.id === user.id;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-8 transition-colors duration-200 text-slate-800 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>

        {/* Hero Banner Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-brand-950 rounded-3xl p-6 sm:p-10 text-white shadow-elevated border border-slate-800 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-wider text-brand-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{course.category || 'General Technology'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              {course.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-2xl">
              {course.description || 'Gain comprehensive mastery of full-stack engineering principles with structured modules, real-world source code, and practical exercises.'}
            </p>

            {/* Instructor Badge */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-white font-bold flex items-center justify-center text-sm shadow-soft">
                {course.instructor?.name ? course.instructor.name.charAt(0).toUpperCase() : 'I'}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-100">{course.instructor?.name || 'Authorized Instructor'}</p>
                <p className="text-slate-400">{course.instructor?.email || 'Instructor Profile'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Curriculum Syllabus on Left, Action Box on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Curriculum */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Course Curriculum & Lessons</h2>
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {contents.length} {contents.length === 1 ? 'Lesson' : 'Lessons'}
                </span>
              </div>

              {contents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  The instructor has not published lessons for this course yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-neutral-900">
                  {contents.map((item, idx) => {
                    const type = (item.contenttype || '').toUpperCase();
                    return (
                      <div key={item.id || idx} className="py-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                            #{item.sequenceOrder || idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                                Lesson {idx + 1}
                              </span>
                              <Badge variant={type === 'VIDEO' ? 'primary' : type === 'PDF' ? 'danger' : 'purple'} size="xs">
                                {type}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate max-w-md font-mono mt-0.5">
                              {item.contenturl}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-slate-400">
                          {type === 'VIDEO' ? (
                            <PlayCircle className="w-5 h-5 text-brand-500" />
                          ) : type === 'PDF' ? (
                            <FileText className="w-5 h-5 text-rose-500" />
                          ) : (
                            <HelpCircle className="w-5 h-5 text-purple-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Enrollment Card */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft sticky top-24">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">Enrollment Status</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Enroll now to access all multimedia modules, track your progress step-by-step, and receive automatic confirmation alerts.
              </p>

              {isOwner ? (
                <div className="space-y-3">
                  <div className="p-3 bg-brand-50 dark:bg-brand-950/40 rounded-xl text-brand-800 dark:text-brand-300 text-xs font-medium">
                    You are the instructor and author of this course.
                  </div>
                  <Link
                    to={`/instructor/course/${course.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-soft"
                  >
                    <span>Manage Lessons & Curriculum</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : isEnrolled ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>You are currently enrolled in this course!</span>
                  </div>
                  <Link
                    to={`/learn/course/${course.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-soft"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Open Study Lab Classroom</span>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-elevated flex items-center justify-center gap-2 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{enrolling ? 'Enrolling...' : 'Enroll in Course'}</span>
                </button>
              )}

              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-neutral-900 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant access to {contents.length} multimedia lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time learning progress synchronization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Automated Gmail notification receipts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

