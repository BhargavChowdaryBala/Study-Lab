import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authApi } from '../../api/authApi';
import { courseApi } from '../../api/courseApi';
import { enrollmentApi } from '../../api/enrollmentApi';
import { notificationApi } from '../../api/notificationApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { RoleBadge, StatusBadge, Badge } from '../../components/common/Badge';
import { 
  ShieldCheck, 
  UserCheck, 
  BookOpen, 
  Users, 
  Bell, 
  Send, 
  Trash2, 
  Check, 
  X, 
  Mail, 
  Clock, 
  AlertCircle, 
  Layers, 
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user, isAdmin, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('verifications');
  const [loading, setLoading] = useState(true);

  // Data states
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [enrollmentsList, setEnrollmentsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);

  // Email dispatch state
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Search & filter
  const [userSearch, setUserSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      showToast('Access denied: Administrator privileges required.', 'error');
      navigate('/');
      return;
    }
    loadAdminData();
  }, [isAuthenticated, isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [pending, approved, users, courses, enrollments, notifications] = await Promise.all([
        authApi.getPendingInstructors().catch(() => []),
        authApi.getAllInstructors().catch(() => []),
        authApi.getAllUsers().catch(() => []),
        courseApi.getAllCourses().catch(() => []),
        enrollmentApi.getAllEnrollments().catch(() => []),
        notificationApi.getAllNotifications().catch(() => []),
      ]);

      setPendingInstructors(pending || []);
      setAllInstructors(approved || []);
      setUsersList(users || []);
      setCoursesList(courses || []);
      setEnrollmentsList(enrollments || []);
      setNotificationsList(notifications || []);
    } catch (err) {
      showToast(err.message || 'Error fetching administrator data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyInstructor = async (id, status) => {
    try {
      await authApi.updateInstructorStatus(id, status);
      showToast(`Instructor ${status.toLowerCase()} successfully! Email alert sent.`, 'success');
      loadAdminData();
    } catch (err) {
      showToast(err.message || `Failed to update instructor status`, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await authApi.deleteUser(id);
      showToast('User deleted successfully.', 'info');
      setUsersList((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      showToast(err.message || 'Cannot delete user: Check enrolled courses.', 'error');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course from system?')) return;
    try {
      await courseApi.deleteCourse(id);
      showToast('Course removed from platform.', 'info');
      setCoursesList((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete course', 'error');
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailTo.trim() || !emailSubject.trim() || !emailBody.trim()) {
      showToast('Please fill out all email fields.', 'error');
      return;
    }

    setSendingEmail(true);
    try {
      await notificationApi.sendCustomEmail(emailTo.trim(), emailSubject.trim(), emailBody.trim());
      showToast(`Custom email dispatched to ${emailTo}!`, 'success');
      setEmailModalOpen(false);
      setEmailTo('');
      setEmailSubject('');
      setEmailBody('');
      // Reload notifications
      const updatedNotifications = await notificationApi.getAllNotifications();
      setNotificationsList(updatedNotifications || []);
    } catch (err) {
      showToast(err.message || 'Failed to dispatch email.', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-10 transition-colors duration-200 text-slate-800 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator Command Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Platform Governance & Auditing
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Review instructor applications, manage system-wide courses, monitor enrollments, and broadcast email alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmailModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-soft transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Email</span>
            </button>
            <button
              onClick={loadAdminData}
              className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-soft transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metric KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Users</span>
              <Users className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{usersList.length}</p>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Pending Review</span>
              <UserCheck className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{pendingInstructors.length}</p>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Active Courses</span>
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{coursesList.length}</p>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Enrollments</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{enrollmentsList.length}</p>
          </div>

          <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Notifications</span>
              <Bell className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{notificationsList.length}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-neutral-900 rounded-2xl overflow-x-auto">
          {[
            { id: 'verifications', label: `Pending Instructors (${pendingInstructors.length})` },
            { id: 'courses', label: `Courses (${coursesList.length})` },
            { id: 'users', label: `User Directory (${usersList.length})` },
            { id: 'enrollments', label: `Enrollments (${enrollmentsList.length})` },
            { id: 'notifications', label: `Notification Audit (${notificationsList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-neutral-800 text-purple-900 dark:text-purple-200 shadow-soft'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Pending Instructor Verifications */}
        {activeTab === 'verifications' && (
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Pending Instructor Applications</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Approving an instructor grants course creation privileges and dispatches an automated approval email.
              </p>
            </div>

            {pendingInstructors.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center">
                <UserCheck className="w-10 h-10 text-emerald-400 mb-2" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">All applications processed!</p>
                <p className="text-slate-400 mt-1">There are no pending instructor applications awaiting review.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingInstructors.map((inst) => (
                  <div
                    key={inst.id}
                    className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{inst.name}</span>
                        <StatusBadge status={inst.verificationStatus} />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 font-mono">{inst.email}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Registered Role: <RoleBadge role={inst.role} />
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t border-amber-200/60 dark:border-amber-900/60 mt-4">
                      <button
                        onClick={() => handleVerifyInstructor(inst.id, 'APPROVED')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-soft transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleVerifyInstructor(inst.id, 'REJECTED')}
                        className="flex-1 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Course Governance */}
        {activeTab === 'courses' && (
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">System Course Catalog</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Monitor and govern courses created by instructors</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Filter courses..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-neutral-900 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Course Title</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Instructor</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
                  {coursesList
                    .filter((c) => (c.title || '').toLowerCase().includes(courseSearch.toLowerCase()))
                    .map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-neutral-900/60">
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-neutral-200 max-w-xs truncate">
                          {course.title}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                            {course.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                          {course.instructor?.name || 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete course"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: User Directory */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">All Registered Users</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Students, Instructors, and System Administrators</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-neutral-900 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Verification</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
                  {usersList
                    .filter((u) => 
                      (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                      (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-neutral-900/60">
                        <td className="py-3 px-3 text-slate-400 font-mono">#{item.id}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-neutral-200">{item.name}</td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-mono">{item.email}</td>
                        <td className="py-3 px-3">
                          <RoleBadge role={item.role} />
                        </td>
                        <td className="py-3 px-3">
                          <StatusBadge status={item.verificationStatus} />
                        </td>
                        <td className="py-3 px-3 text-right">
                          {item.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleDeleteUser(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Enrollments */}
        {activeTab === 'enrollments' && (
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">System-wide Enrollments Ledger</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">All student course registrations and current lifecycle status</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-neutral-900 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Enrollment ID</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Course Title</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
                  {enrollmentsList.map((enr) => (
                    <tr key={enr.id} className="hover:bg-slate-50 dark:hover:bg-neutral-900/60">
                      <td className="py-3 px-3 font-mono text-slate-400">#{enr.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-neutral-200">
                        {enr.student?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {enr.course?.title || 'N/A'}
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
          </div>
        )}

        {/* Tab 5: Notification Audit & Broadcast */}
        {activeTab === 'notifications' && (
          <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-900">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Email & Alert Audit Logs</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">History of all transactional emails dispatched via Spring Mail</p>
              </div>

              <button
                onClick={() => setEmailModalOpen(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-soft transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Custom Email</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-neutral-900">
              {notificationsList.map((item) => (
                <div key={item.id} className="py-3.5 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-neutral-200 text-xs">{item.subject}</span>
                      <Badge variant={item.type === 'ENROLLMENT' ? 'success' : item.type === 'INSTRUCTOR_APPROVAL' ? 'purple' : 'primary'} size="xs">
                        {item.type || 'GENERAL'}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {item.sentAt ? new Date(item.sentAt).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Recipient: <span className="font-mono text-slate-700 dark:text-slate-300">{item.recipientEmail}</span></p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-neutral-900 p-2.5 rounded-lg border border-slate-100 dark:border-neutral-800 font-mono whitespace-pre-line mt-1">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Custom Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-elevated border border-slate-200 dark:border-neutral-800 max-w-lg w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/40">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Broadcast Custom Email</h3>
              </div>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Platform Maintenance Notice"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Message Body
                </label>
                <textarea
                  rows={5}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Compose your custom email content..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-soft disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingEmail ? 'Dispatching...' : 'Dispatch Email'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

