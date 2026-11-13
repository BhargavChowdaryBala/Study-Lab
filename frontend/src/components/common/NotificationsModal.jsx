import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../api/notificationApi';
import { Bell, Mail, Clock, Check, X, AlertCircle } from 'lucide-react';
import { Badge } from './Badge';

export const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const loadNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationApi.getMyNotifications();
      setNotifications(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-elevated border border-slate-200 dark:border-neutral-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] text-slate-800 dark:text-neutral-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50/70 dark:bg-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Your Notifications</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live email & system alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto divide-y divide-slate-100 dark:divide-neutral-900 flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading your alerts...</div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center">
              <Mail className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No notifications yet</p>
              <p className="text-xs text-slate-400 mt-1">
                You'll receive notifications when you enroll in courses or when admins send announcements.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-neutral-200 text-sm">{item.subject}</span>
                  <Badge variant={item.type === 'ENROLLMENT' ? 'success' : item.type === 'INSTRUCTOR_APPROVAL' ? 'purple' : 'primary'} size="xs">
                    {item.type || 'GENERAL'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-slate-50 dark:bg-neutral-900 p-3 rounded-lg border border-slate-100 dark:border-neutral-800 font-mono">
                  {item.message}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.sentAt ? new Date(item.sentAt).toLocaleString() : 'Recent'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

