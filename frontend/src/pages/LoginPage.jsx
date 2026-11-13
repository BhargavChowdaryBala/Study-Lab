import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Lock,
  Mail,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  Sparkles,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

export const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If prefilled values were sent via router state or location
  useEffect(() => {
    if (location.state?.prefilledEmail) {
      setEmail(location.state.prefilledEmail);
    }
    if (location.state?.prefilledPassword) {
      setPassword(location.state.prefilledPassword);
    }
  }, [location.state]);

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectByRole(user.role);
    }
  }, [isAuthenticated, user]);

  const redirectByRole = (role) => {
    if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role === 'INSTRUCTOR') {
      navigate('/instructor/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      redirectByRole(loggedUser.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
      showToast('Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (roleEmail, rolePassword) => {
    setEmail(roleEmail);
    setPassword(rolePassword);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-black transition-colors duration-200">
      <div className="max-w-md w-full space-y-6">

        {/* Top Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-elevated mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In to Study Lab
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access your courses, dashboard, and learning analytics
          </p>
        </div>

        {/* Quick Demo Credentials Autofill Banner */}
        <div className="bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-950 border border-brand-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-soft">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900 dark:text-brand-300 mb-2">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Quick Login with Existing Accounts:</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2.5">
            Select an account role below to test role-based capabilities, or use your newly registered account:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('student@example.com', 'password123')}
              className="py-1.5 px-2 bg-white dark:bg-neutral-800 hover:bg-brand-100 dark:hover:bg-neutral-700 border border-brand-200 dark:border-neutral-700 text-brand-800 dark:text-brand-200 rounded-lg text-[11px] font-semibold text-center transition-colors shadow-xs"
            >
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('instructor@example.com', 'password123')}
              className="py-1.5 px-2 bg-white dark:bg-neutral-800 hover:bg-brand-100 dark:hover:bg-neutral-700 border border-brand-200 dark:border-neutral-700 text-brand-800 dark:text-brand-200 rounded-lg text-[11px] font-semibold text-center transition-colors shadow-xs"
            >
              Instructor Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@example.com', 'password123')}
              className="py-1.5 px-2 bg-white dark:bg-neutral-800 hover:bg-brand-100 dark:hover:bg-neutral-700 border border-brand-200 dark:border-neutral-700 text-brand-800 dark:text-brand-200 rounded-lg text-[11px] font-semibold text-center transition-colors shadow-xs"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-neutral-950 rounded-2xl shadow-soft border border-slate-200 dark:border-neutral-900 p-6 sm:p-8 text-slate-800 dark:text-neutral-100">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-soft flex items-center justify-center gap-2 transition-all mt-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Study Lab'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-neutral-900 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Protected by Spring Security HTTP Basic & BCrypt (strength 12)</span>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

