import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { courseApi } from '../../api/courseApi';
import { contentApi } from '../../api/contentApi';
import { enrollmentApi } from '../../api/enrollmentApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { StatusBadge, Badge } from '../../components/common/Badge';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  Users,
  BookOpen,
  Save,
  X,
  AlertCircle,
  PlayCircle
} from 'lucide-react';

export const InstructorCourseManager = () => {
  const { id } = useParams();
  const { user, isInstructor, isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [enrollees, setEnrollees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit course form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);

  // Add content modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [contentType, setContentType] = useState('VIDEO');
  const [contentUrl, setContentUrl] = useState('');
  const [sequenceOrder, setSequenceOrder] = useState(1);
  const [addingContent, setAddingContent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [id, isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const courseData = await courseApi.getCourseById(id);
      setCourse(courseData);
      setTitle(courseData.title || '');
      setDescription(courseData.description || '');
      setCategory(courseData.category || 'Web Development');

      // Load contents
      try {
        const contentsData = await contentApi.getContentByCourse(id);
        setContents(contentsData || []);
        setSequenceOrder((contentsData?.length || 0) + 1);
      } catch {
        setContents([]);
      }

      // Load enrollees
      try {
        const enrolleesData = await enrollmentApi.getByCourse(id);
        setEnrollees(enrolleesData || []);
      } catch {
        setEnrollees([]);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load course details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    setSavingCourse(true);
    try {
      const updated = await courseApi.updateCourse(id, {
        title,
        description,
        category,
      });
      setCourse(updated);
      showToast('Course details updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update course', 'error');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    if (!contentUrl.trim()) {
      showToast('Content URL or quiz description is required.', 'error');
      return;
    }

    setAddingContent(true);
    try {
      await contentApi.addContent(id, {
        contenttype: contentType,
        contenturl: contentUrl.trim(),
        sequenceOrder: Number(sequenceOrder) || 1,
      });

      showToast('Lesson added successfully!', 'success');
      setAddModalOpen(false);
      setContentUrl('');
      // Reload contents
      const updatedContents = await contentApi.getContentByCourse(id);
      setContents(updatedContents || []);
      setSequenceOrder((updatedContents?.length || 0) + 1);
    } catch (err) {
      showToast(err.message || 'Failed to add lesson content', 'error');
    } finally {
      setAddingContent(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Delete this lesson from the curriculum?')) return;
    try {
      await contentApi.deleteContent(contentId);
      showToast('Lesson deleted.', 'info');
      setContents((prev) => prev.filter((c) => c.id !== contentId));
    } catch (err) {
      showToast(err.message || 'Failed to delete lesson', 'error');
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Are you sure you want to delete this entire course? This cannot be undone.')) {
      return;
    }
    try {
      await courseApi.deleteCourse(id);
      showToast('Course deleted successfully.', 'info');
      navigate('/instructor/dashboard');
    } catch (err) {
      showToast(err.message || 'Failed to delete course', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black py-16">
        <LoadingSpinner size="lg" text="Loading course manager..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-8 transition-colors duration-200 text-slate-800 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/instructor/dashboard"
              className="w-9 h-9 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 flex items-center justify-center transition-colors shadow-soft shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                Curriculum Editor
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {course?.title || 'Manage Course'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/courses/${id}`}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition-colors shadow-soft"
            >
              <PlayCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Preview Course</span>
            </Link>
            <button
              onClick={handleDeleteCourse}
              className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Course</span>
            </button>
          </div>
        </div>

        {/* Section 1: Edit Course Details Form */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-neutral-900">
            Course Metadata & Settings
          </h2>
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Java & Spring Boot"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingCourse}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-soft disabled:opacity-60 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{savingCourse ? 'Saving...' : 'Update Details'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Manage Course Content / Lessons */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-neutral-900">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Curriculum Syllabus & Lessons</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Polymorphic video streams, downloadable PDFs, and modular quizzes
              </p>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-soft transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lesson</span>
            </button>
          </div>

          {contents.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-xs">
              No lessons added yet. Click "Add Lesson" to structure your course curriculum.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-neutral-900">
              {contents.map((item, index) => {
                const type = (item.contenttype || '').toUpperCase();
                return (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0">
                        #{item.sequenceOrder || index + 1}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-neutral-200">
                            Lesson {index + 1}
                          </span>
                          <Badge variant={type === 'VIDEO' ? 'primary' : type === 'PDF' ? 'danger' : 'purple'} size="xs">
                            {type}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono max-w-lg">
                          {item.contenturl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteContent(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Delete lesson"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 3: Enrolled Students Roster */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-neutral-900">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Enrolled Students Roster</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {enrollees.length} {enrollees.length === 1 ? 'Student' : 'Students'}
            </span>
          </div>

          {enrollees.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No students have enrolled in this course yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-neutral-900 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Enrolled Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
                  {enrollees.map((enr) => (
                    <tr key={enr.id} className="hover:bg-slate-50 dark:hover:bg-neutral-900/60">
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-neutral-200">
                        {enr.student?.name || 'Student'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {enr.student?.email || 'N/A'}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={enr.status} />
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {enr.enrolledAt ? enr.enrolledAt.toString() : 'Today'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Lesson Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-elevated border border-slate-200 dark:border-neutral-800 max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50/70 dark:bg-neutral-900">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Add Lesson to Curriculum</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Content Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContentType('VIDEO')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${contentType === 'VIDEO'
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <Video className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span>Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('PDF')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${contentType === 'PDF'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : 'border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>PDF Doc</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('QUIZZ')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${contentType === 'QUIZZ'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                        : 'border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Quiz</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  {contentType === 'VIDEO' ? 'Video Stream URL (YouTube, MP4, etc.)' : contentType === 'PDF' ? 'PDF Document URL' : 'Quiz Concept Title / URL'}
                </label>
                <input
                  type="text"
                  required
                  value={contentUrl}
                  onChange={(e) => setContentUrl(e.target.value)}
                  placeholder={
                    contentType === 'VIDEO'
                      ? 'https://www.youtube.com/watch?v=...'
                      : contentType === 'PDF'
                        ? 'https://example.com/slides.pdf'
                        : 'Spring Security Filter Chains & DelegatingFilterProxy'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Sequence Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={sequenceOrder}
                  onChange={(e) => setSequenceOrder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingContent}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider shadow-soft disabled:opacity-60"
                >
                  {addingContent ? 'Adding...' : 'Add Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

  );
};

