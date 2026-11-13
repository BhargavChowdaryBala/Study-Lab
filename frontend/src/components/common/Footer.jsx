import React from 'react';
import { GraduationCap, Heart, Github, Shield, Server, Database, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black text-slate-400 text-sm border-t border-slate-800 dark:border-neutral-900 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Study Lab</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An enterprise-grade Online Course Management System built with Spring Boot 3, Spring Security 6 (HTTP Basic, BCrypt & RBAC), Hibernate JPA, and a modern React frontend.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] text-slate-300 font-mono">
                <Server className="w-3 h-3 text-brand-400" /> Spring Boot 3.4
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] text-slate-300 font-mono">
                <Shield className="w-3 h-3 text-emerald-400" /> Spring Security
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] text-slate-300 font-mono">
                <Database className="w-3 h-3 text-blue-400" /> MySQL + JPA
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-[11px] text-slate-300 font-mono">
                <Code className="w-3 h-3 text-purple-400" /> React 18 + Vite
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-3">Platform Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">Course Catalog</Link>
              </li>
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">Student Learning Hub</Link>
              </li>
              <li>
                <Link to="/instructor/dashboard" className="hover:text-white transition-colors">Instructor Studio</Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Command Center</Link>
              </li>
            </ul>
          </div>

          {/* Key modules */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Role-Based Access Control (RBAC)</li>
              <li>Instructor Verification Workflow</li>
              <li>Polymorphic Content (Video/PDF/Quiz)</li>
              <li>Granular Learning Progress Tracking</li>
              <li>Automated Email Notifications</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Online Course Management System. Designed & Developed by Bhargav.
          </p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built for academic excellence & industry resume readiness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

