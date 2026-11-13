import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { courseApi } from '../../api/courseApi';
import { enrollmentApi } from '../../api/enrollmentApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge } from '../../components/common/Badge';
import { 
  LayoutDashboard, 
  Plus, 
  BookOpen, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  AlertCircle,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

export const InstructorDashboard = () => {
  const { user, isInstructor, isApprovedInstructor, refreshUser, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create Course Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [submittingCourse, setSubmittingCourse] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadInstructorData();
  }, [user, isAuthenticated]);

  const loadInstructorData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (user?.id) {
        // Fetch courses for this instructor
        const myCourses = await courseApi.getCoursesByInstructor(user.id);
        setCourses(myCourses || []);

        // Fetch enrollees count across their courses
        let studentCount = 0;
        for (const c of myCourses || []) {
          try {
            const enrollments = await enrollmentApi.getByCourse(c.id);
            studentCount += (enrollments || []).length;
          } catch {
            // Ignore if unauthorized
          }
        }
        setTotalStudents(studentCount);
      }
    } catch (err) {
      setError(err.message || 'Could not load instructor courses.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!isApprovedInstructor) {
      showToast('You must be an approved instructor to publish courses.', 'warning');
      return;
    }

    if (!newTitle.trim()) {
      showToast('Course title is required.', 'error');
      return;
    }

    setSubmittingCourse(true);
    try {
      await courseApi.createCourse({
        title: newTitle.trim(),
        Description: newDescription.trim() || 'Comprehensive technical curriculum.',
        Category: newCategory,
      });

      showToast('Course created successfully!', 'success');
      setCreateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      loadInstructorData();
    } catch (err) {
      showToast(err.message || 'Failed to create course.', 'error');
    } finally {
      setSubmittingCourse(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-10 transition-colors duration-200 text-slate-800 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Verification Alert Banner if PENDING */}
        {!isApprovedInstructor && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Instructor Verification Status: PENDING</h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                  Your instructor registration is currently awaiting administrator review. An administrator must approve your profile from the Admin Portal before you can create courses or publish lessons.
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                await refreshUser();
                showToast('Status checked with backend database.', 'info');
              }}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-xs"
            >
              Refresh Approval Status
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">
              <LayoutDashboard className="w-4 h-4" />
              <span>Instructor Studio</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Instructor Studio & Curriculum
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Author courses, upload polymorphic video and document modules, and track enrollees.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isApprovedInstructor) {
                showToast('Action forbidden: Your instructor account is pending administrator approval.', 'warning');
                return;
              }
              setCreateModalOpen(true);
            }}
            className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-soft transition-all ${
              isApprovedInstructor
                ? 'bg-brand-600 hover:bg-brand-700 text-white'
                : 'bg-slate-200 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">My Authored Courses</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{courses.length}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Enrolled Students</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalStudents}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-5 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Approval State</p>
              <div className="mt-1">
                <StatusBadge status={user?.verificationStatus} />
              </div>
            </div>
          </div>
        </div>

        {/* Authored Courses Table / Grid */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-neutral-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Authored Courses</h2>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading courses from database..." />
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">You haven't authored any courses yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6 max-w-sm mx-auto">
                {isApprovedInstructor
                  ? 'Click "Create New Course" above to publish your first curriculum with videos and documents.'
                  : 'Once your instructor status is approved by an Admin, you will be able to create courses.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 p-5 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md">
                      {course.category || 'Curriculum'}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-2 mb-1 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {course.description || 'Comprehensive curriculum with videos, PDFs, and quizzes.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-neutral-800">
                    <Link
                      to={`/instructor/course/${course.id}`}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-neutral-800 hover:bg-slate-800 dark:hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-soft"
                    >
                      <span>Manage Lessons & Enrollees</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Course Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-elevated border border-slate-200 dark:border-neutral-800 max-w-lg w-full overflow-hidden text-slate-800 dark:text-neutral-100">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-900 flex items-center justify-between bg-slate-50/70 dark:bg-neutral-900/50">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Create New Course</h3>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems with Java & Spring Cloud"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Java & Spring Boot">Java & Spring Boot</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Mobile Development">Mobile Development</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Course Description
                </label>
                <textarea
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summarize course learning outcomes, prerequisite skills, and hands-on modules..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCourse}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider shadow-soft disabled:opacity-60"
                >
                  {submittingCourse ? 'Publishing...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

