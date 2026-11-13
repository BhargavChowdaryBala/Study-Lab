import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { enrollmentApi } from '../../api/enrollmentApi';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Laptop, BookOpen, Compass, ArrowRight } from 'lucide-react';

export const StudyLabRedirectPage = () => {
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const checkEnrollments = async () => {
      try {
        const data = await enrollmentApi.getMyEnrollments();
        const active = (data || []).filter((e) => e.status !== 'CANCEL' && e.course?.id);
        
        if (active.length > 0) {
          // Immediately redirect to the first active course's Study Lab
          navigate(`/learn/course/${active[0].course.id}`, { replace: true });
        } else {
          setEnrollments([]);
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    };

    checkEnrollments();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <LoadingSpinner size="lg" text="Launching Study Lab environment..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-950 border border-neutral-900 rounded-3xl p-8 text-center shadow-elevated">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
          <Laptop className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">Welcome to Study Lab</h2>
        <p className="text-xs text-neutral-400 leading-relaxed mb-6">
          You don't have an active enrolled course to launch in the Study Lab yet. Enroll in a course from our catalog to unlock video streaming, code scratchpads, and notes!
        </p>
        <Link
          to="/courses"
          className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-soft"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Course Catalog</span>
        </Link>
      </div>
    </div>
  );
};

