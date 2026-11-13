import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  GraduationCap, 
  BookOpen, 
  Compass, 
  LayoutDashboard, 
  ShieldCheck, 
  Bell, 
  LogOut, 
  User, 
  Menu, 
  X,
  Sparkles,
  ChevronDown,
  Laptop,
  Moon,
  Sun
} from 'lucide-react';
import { RoleBadge, StatusBadge } from './Badge';
import { NotificationsModal } from './NotificationsModal';
import { DemoAccountsModal } from './DemoAccountsModal';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isStudent, isInstructor, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/95 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Logo & Brand: Study Lab */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-400 text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-800 dark:from-white dark:via-brand-200 dark:to-indigo-300 bg-clip-text text-transparent">
                Study Lab
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 -mt-1">
                Course Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Link
              to="/courses"
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/courses')
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-neutral-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Courses</span>
            </Link>

            {isAuthenticated && isStudent && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive('/student/dashboard')
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-neutral-900'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Learning</span>
                </Link>

                <Link
                  to="/studylab"
                  className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    location.pathname.startsWith('/learn/course/') || isActive('/studylab')
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-neutral-900'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Study Lab</span>
                </Link>
              </>
            )}

            {isAuthenticated && isInstructor && (
              <Link
                to="/instructor/dashboard"
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/instructor/dashboard')
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-neutral-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Instructor Studio</span>
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/admin/dashboard')
                    ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-neutral-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Command Center</span>
              </Link>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            
            {/* 🌙 / ☀️ PROMINENT DARK / BLACK THEME TOGGLE BUTTON */}
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:scale-105 cursor-pointer ${
                isDark 
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700' 
                  : 'bg-slate-900 hover:bg-black text-white border border-slate-800'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch background to Black Mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">Black BG</span>
                </>
              )}
            </button>

            {/* Demo Accounts button for recruiters & testing */}
            <button
              onClick={() => setDemoModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/70 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-semibold transition-all duration-150"
              title="Test role-based access for Student, Instructor, and Admin"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>Roles & Demo</span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <button
                  onClick={() => setNotificationsOpen(true)}
                  className="w-9 h-9 rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-neutral-900 flex items-center justify-center transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>

                {/* User Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block text-left text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[100px]">
                        {user?.name || 'User'}
                      </p>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        {user?.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-950 rounded-2xl shadow-elevated border border-slate-200 dark:border-neutral-800 py-2 z-50 animate-fade-in text-slate-800 dark:text-neutral-100"
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-neutral-900">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <RoleBadge role={user?.role} />
                          {user?.role === 'INSTRUCTOR' && (
                            <StatusBadge status={user?.verificationStatus} />
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        {isStudent && (
                          <>
                            <Link
                              to="/student/dashboard"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-brand-600"
                            >
                              <BookOpen className="w-4 h-4" />
                              <span>My Enrolled Courses</span>
                            </Link>
                            <Link
                              to="/studylab"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-brand-600"
                            >
                              <Laptop className="w-4 h-4" />
                              <span>Study Lab Classroom</span>
                            </Link>
                          </>
                        )}

                        {isInstructor && (
                          <Link
                            to="/instructor/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-brand-600"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Instructor Studio</span>
                          </Link>
                        )}

                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-purple-600"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setNotificationsOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-brand-600 text-left"
                        >
                          <Bell className="w-4 h-4" />
                          <span>Notification Alerts</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-neutral-900">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-soft transition-all duration-150"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-neutral-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-neutral-900 bg-white dark:bg-black px-4 py-4 space-y-2 animate-fade-in text-slate-800 dark:text-slate-200">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-neutral-900 font-medium"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Courses</span>
            </Link>

            {isAuthenticated && isStudent && (
              <>
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-neutral-900 font-medium"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Learning</span>
                </Link>

                <Link
                  to="/studylab"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-neutral-900 font-medium text-brand-600 dark:text-brand-400"
                >
                  <Laptop className="w-4 h-4" />
                  <span>Study Lab</span>
                </Link>
              </>
            )}

            {isAuthenticated && isInstructor && (
              <Link
                to="/instructor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-neutral-900 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Instructor Studio</span>
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-neutral-900 font-medium"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Portal</span>
              </Link>
            )}

            {/* Mobile Theme Toggle Button */}
            <button
              onClick={() => {
                toggleTheme();
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
                isDark 
                  ? 'bg-neutral-900 border-neutral-800 text-amber-300' 
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                {isDark ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Moon className="w-4 h-4 text-amber-400 fill-amber-400" />}
                <span>{isDark ? 'Background: Pure Black' : 'Change Background to Black'}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-black/30 font-semibold">{isDark ? 'Light' : 'Black'}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setDemoModalOpen(true);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/40 font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Spring Security Roles Guide</span>
            </button>
          </div>
        )}
      </header>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Demo Accounts Modal */}
      <DemoAccountsModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onSelectAccount={(email, password) => {
          navigate('/login', { state: { prefilledEmail: email, prefilledPassword: password } });
        }}
      />
    </>
  );
};
