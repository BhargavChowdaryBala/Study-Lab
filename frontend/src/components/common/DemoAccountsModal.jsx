import React from 'react';
import { Shield, UserCheck, BookOpen, Key, CheckCircle, X } from 'lucide-react';
import { RoleBadge } from './Badge';

export const DemoAccountsModal = ({ isOpen, onClose, onSelectAccount }) => {
  if (!isOpen) return null;

  const accounts = [
    {
      role: 'STUDENT',
      title: 'Student Account',
      description: 'Instant registration, browse courses, enroll in curriculum, track learning progress, and earn certificates.',
      recommendedEmail: 'student@example.com',
      samplePassword: 'password123',
      permissions: ['Browse & Search Courses', 'Enroll in Courses', 'Mark Lessons Complete', 'View My Progress & Certificates'],
    },
    {
      role: 'INSTRUCTOR',
      title: 'Instructor Account',
      description: 'Requires Admin approval. Once approved, instructors can create courses, structure syllabus, and upload lessons.',
      recommendedEmail: 'instructor@example.com',
      samplePassword: 'password123',
      permissions: ['Create New Courses', 'Add Videos, PDFs & Quizzes', 'Manage Curriculum Sequence', 'Track Enrolled Students'],
    },
    {
      role: 'ADMIN',
      title: 'Administrator Account',
      description: 'Full system privileges. Pre-configured in database with full authority over users, courses, and security.',
      recommendedEmail: 'admin@example.com',
      samplePassword: 'password123',
      permissions: ['Approve / Reject Instructors', 'System-wide Course Governance', 'User Management & Deletion', 'Audit & Broadcast Notifications'],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-elevated border border-slate-200 dark:border-neutral-800 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-800 dark:text-neutral-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-gradient-to-r from-brand-50 to-indigo-50/50 dark:from-neutral-900 dark:to-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-soft">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Spring Security Roles & Testing Guide</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">How authentication & RBAC works in this system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white/80 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="p-3.5 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-200/80 dark:border-neutral-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold text-slate-800 dark:text-white">Security Architecture: </span>
            This application uses <strong>Spring Security 6</strong> with <strong>HTTP Basic Authentication</strong> and stateless sessions.
            Passphrases are hashed with <strong>BCrypt (strength 12)</strong>. Role-based authorization is enforced at method and endpoint levels via <code className="text-brand-600 dark:text-brand-400 bg-white dark:bg-black px-1 py-0.5 rounded border border-slate-200 dark:border-neutral-700">@PreAuthorize</code>.
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {accounts.map((acc) => (
              <div
                key={acc.role}
                className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-soft transition-all duration-200 bg-white dark:bg-neutral-900 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{acc.title}</span>
                      <RoleBadge role={acc.role} />
                    </div>
                    {onSelectAccount && (
                      <button
                        onClick={() => {
                          onSelectAccount(acc.recommendedEmail, acc.samplePassword);
                          onClose();
                        }}
                        className="px-3 py-1 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        Autofill Credentials
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{acc.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-neutral-800">
                  {acc.permissions.map((perm, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/70 dark:bg-neutral-900 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Tip: You can also register a brand new Student or Instructor account via the sign-up page!</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-medium rounded-lg transition-colors text-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

