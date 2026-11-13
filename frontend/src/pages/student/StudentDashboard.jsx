import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { enrollmentApi } from '../../api/enrollmentApi';
import { progressApi } from '../../api/progressApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ProgressBar } from '../../components/common/ProgressBar';
import { StatusBadge } from '../../components/common/Badge';
import {
  BookOpen,
  PlayCircle,
  Award,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Compass,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user, isStudent, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadStudentData();
  }, [isAuthenticated]);

  const loadStudentData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enrollmentApi.getMyEnrollments();
      setEnrollments(data || []);

      // Load progress summaries for each enrollment
      const progressPromises = (data || []).map(async (enr) => {
        try {
          const summary = await progressApi.getProgressSummary(enr.id);
          return { enrollmentId: enr.id, summary };
        } catch {
          return { enrollmentId: enr.id, summary: null };
        }
      });

      const summaries = await Promise.all(progressPromises);
      const map = {};
      summaries.forEach((s) => {
        if (s.summary) map[s.enrollmentId] = s.summary;
      });
      setProgressMap(map);
    } catch (err) {
      setError(err.message || 'Could not load your enrollments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnrollment = async (enrollmentId) => {
    if (!window.confirm('Are you sure you want to cancel this enrollment?')) {
      return;
    }

    setCancellingId(enrollmentId);
    try {
      await enrollmentApi.cancelEnrollment(enrollmentId);
      showToast('Enrollment cancelled.', 'info');
      // Refresh list
      loadStudentData();
    } catch (err) {
      showToast(err.message || 'Failed to cancel enrollment.', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const ongoingCount = enrollments.filter((e) => e.status === 'ONGOING').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-10 transition-colors duration-200 text-slate-800 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">
              <UserCheck className="w-4 h-4" />
              <span>Student Learning Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track your course progression, resume video lectures, and complete certifications.
            </p>
          </div>

          <Link
            to="/courses"
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-2 shadow-soft transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explore More Courses</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Enrolled Courses</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{enrollments.length}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">In Progress</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{ongoingCount}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Completed</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{completedCount}</h3>
            </div>
          </div>
        </div>

        {/* Course List Section */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-neutral-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Enrolled Courses</h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {enrollments.length} {enrollments.length === 1 ? 'Course' : 'Courses'} Total
            </span>
          </div>

          {loading ? (
            <LoadingSpinner text="Retrieving enrolled courses and progress metrics..." />
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">You haven't enrolled in any courses yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6 max-w-sm mx-auto">
                Explore our catalog of industry-grade courses and enroll with one click!
              </p>
              <Link
                to="/courses"
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-soft transition-colors"
              >
                <span>Browse Course Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enr) => {
                const course = enr.course;
                if (!course) return null;

                const summary = progressMap[enr.id];
                const percentage = summary ? summary.progressPercentage : 0;
                const completedLessons = summary ? summary.completedContents : 0;
                const totalLessons = summary ? summary.totalContents : 0;

                return (
                  <div
                    key={enr.id}
                    className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-soft transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
                          {course.category || 'General'}
                        </span>
                        <StatusBadge status={enr.status} />
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {course.description || 'Comprehensive curriculum with video, documents, and quizzes.'}
                      </p>

                      {/* Instructor info */}
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-4">
                        Instructor: <span className="font-semibold text-slate-700 dark:text-slate-300">{course.instructor?.name || 'Instructor'}</span>
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4 pt-3 border-t border-slate-100 dark:border-neutral-800">
                        <ProgressBar percentage={percentage} size="md" />
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex justify-between">
                          <span>{completedLessons} of {totalLessons} lessons completed</span>
                          {percentage === 100 && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-neutral-800">
                      {enr.status === 'CANCEL' ? (
                        <div className="p-2 bg-slate-100 dark:bg-neutral-800 text-slate-500 text-xs rounded-xl text-center font-medium">
                          Enrollment Cancelled
                        </div>
                      ) : (
                        <Link
                          to={`/learn/course/${course.id}`}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-soft transition-all"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{percentage === 100 ? 'Review in Study Lab' : 'Enter Study Lab'}</span>
                        </Link>
                      )}

                      {enr.status === 'ONGOING' && (
                        <button
                          onClick={() => handleCancelEnrollment(enr.id)}
                          disabled={cancellingId === enr.id}
                          className="w-full py-1.5 px-3 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{cancellingId === enr.id ? 'Cancelling...' : 'Cancel Enrollment'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

