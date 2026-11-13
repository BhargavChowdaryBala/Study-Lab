import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-black text-center transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-neutral-950 p-8 rounded-3xl border border-slate-200 dark:border-neutral-900 shadow-soft">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">404</h1>
        <h2 className="text-lg font-bold text-slate-800 dark:text-neutral-200 mb-2">Page Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          The page or curriculum endpoint you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-soft transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

