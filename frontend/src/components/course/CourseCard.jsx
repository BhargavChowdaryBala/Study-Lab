import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CourseCard = ({ 
  course, 
  isEnrolled = false, 
  enrollmentId = null,
  progressPercentage = null,
  onEnroll = null,
  enrolling = false,
  isOwner = false 
}) => {
  const getCategoryColor = (cat) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('java') || lower.includes('web') || lower.includes('program')) return 'primary';
    if (lower.includes('data') || lower.includes('ai') || lower.includes('ml')) return 'purple';
    if (lower.includes('cloud') || lower.includes('devops')) return 'success';
    if (lower.includes('security') || lower.includes('network')) return 'warning';
    return 'default';
  };

  return (
    <div className="bg-white dark:bg-neutral-950 rounded-2xl border border-slate-200 dark:border-neutral-900 shadow-soft hover:shadow-elevated hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Card Header with Category Banner */}
        <div className="h-32 bg-gradient-to-br from-brand-600 via-indigo-600 to-indigo-800 p-5 relative overflow-hidden flex flex-col justify-between text-white">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          
          <div className="flex items-center justify-between z-10">
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white tracking-wider uppercase">
              {course.category || 'General Course'}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div className="z-10">
            <h3 className="text-lg font-bold tracking-tight text-white line-clamp-1 group-hover:text-brand-100 transition-colors">
              {course.title}
            </h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
            {course.description || 'Comprehensive step-by-step curriculum designed to build practical mastery and portfolio projects.'}
          </p>

          {/* Instructor pill */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100 dark:border-neutral-900">
            <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center border border-brand-200 dark:border-brand-800 shrink-0">
              {course.instructor?.name ? course.instructor.name.charAt(0).toUpperCase() : 'I'}
            </div>
            <div className="text-xs overflow-hidden">
              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {course.instructor?.name || 'Authorized Instructor'}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {course.instructor?.email || 'Instructor'}
              </p>
            </div>
          </div>

          {/* Progress indicator if enrolled */}
          {isEnrolled && progressPercentage !== null && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-900">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Course Progress</span>
                <span className="text-brand-600 dark:text-brand-400">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-600 dark:bg-brand-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(progressPercentage)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-5 pt-0">
        {isOwner ? (
          <Link
            to={`/instructor/course/${course.id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-neutral-800 hover:bg-slate-800 dark:hover:bg-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-soft"
          >
            <span>Manage Curriculum</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : isEnrolled ? (
          <Link
            to={`/learn/course/${course.id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-soft"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Resume in Study Lab</span>
          </Link>
        ) : onEnroll ? (
          <div className="flex gap-2">
            <Link
              to={`/courses/${course.id}`}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 text-slate-700 dark:text-slate-300 text-xs font-semibold text-center transition-colors"
            >
              Details
            </Link>
            <button
              onClick={() => onEnroll(course.id)}
              disabled={enrolling}
              className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{enrolling ? 'Enrolling...' : 'Enroll Now'}</span>
            </button>
          </div>
        ) : (
          <Link
            to={`/courses/${course.id}`}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-neutral-700 hover:bg-brand-50/50 dark:hover:bg-neutral-900 text-slate-800 dark:text-neutral-200 hover:text-brand-700 dark:hover:text-brand-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Explore Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};

