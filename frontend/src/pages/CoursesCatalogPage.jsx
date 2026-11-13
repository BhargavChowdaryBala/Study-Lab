import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseApi } from '../api/courseApi';
import { enrollmentApi } from '../api/enrollmentApi';
import { CourseCard } from '../components/course/CourseCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  Search, 
  Compass, 
  Filter, 
  BookOpen, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const CoursesCatalogPage = () => {
  const { isAuthenticated, isStudent, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated) {
        const fetchedCourses = await courseApi.getAllCourses();
        setCourses(fetchedCourses || []);

        if (isStudent) {
          const myEnrollments = await enrollmentApi.getMyEnrollments();
          const ids = new Set((myEnrollments || []).map((e) => e.course?.id).filter(Boolean));
          setEnrolledCourseIds(ids);
        }
      } else {
        // Fallback for public visitors before logging in
        setCourses([
          {
            id: 1,
            title: 'Mastering Spring Boot 3 & Enterprise Microservices',
            description: 'Learn to design resilient RESTful architectures, implement Spring Security with BCrypt and RBAC, and optimize JPA queries with MySQL.',
            category: 'Java & Spring Boot',
            instructor: { id: 1, name: 'Prof. Bhargav Chowdary', email: 'instructor@example.com' },
          },
          {
            id: 2,
            title: 'Modern Full-Stack Development with React 18 & Tailwind CSS',
            description: 'Construct high-performance, single-page web applications with React Context API, Axios HTTP interceptors, and modern responsive layouts.',
            category: 'Frontend Engineering',
            instructor: { id: 2, name: 'Sarah Jenkins', email: 'sarah@example.com' },
          },
          {
            id: 3,
            title: 'Cloud Infrastructure & Kubernetes Microservices',
            description: 'Containerize backend applications, configure scalable Docker containers, and implement robust continuous delivery pipelines.',
            category: 'Cloud & DevOps',
            instructor: { id: 3, name: 'Alex Rivera', email: 'alex@example.com' },
          },
          {
            id: 4,
            title: 'Data Structures & Algorithms in Java',
            description: 'Master time and space complexity, dynamic programming, graph algorithms, and competitive coding fundamentals for technical interviews.',
            category: 'Computer Science',
            instructor: { id: 1, name: 'Prof. Bhargav Chowdary', email: 'instructor@example.com' },
          },
        ]);
      }
    } catch (err) {
      setError(err.message || 'Unable to load course catalog.');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      showToast('Please sign in as a student to enroll in courses.', 'info');
      navigate('/login');
      return;
    }

    if (!isStudent) {
      showToast('Only students can enroll in courses. Switch to a student account.', 'warning');
      return;
    }

    setEnrollingCourseId(courseId);
    try {
      await enrollmentApi.enrollStudent(courseId);
      showToast('Successfully enrolled! Check your email for confirmation.', 'success');
      setEnrolledCourseIds((prev) => new Set([...prev, courseId]));
    } catch (err) {
      showToast(err.message || 'Enrollment failed.', 'error');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  // Derive categories
  const categories = ['ALL', ...new Set(courses.map((c) => c.category).filter(Boolean))];

  // Filtered courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      (course.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">
                <Compass className="w-4 h-4" />
                <span>Explore Knowledge</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Course Catalog & Curriculum
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Browse our structured courses, enroll with a single click, and acquire hands-on engineering skills.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses, topics, instructor..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-neutral-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white transition-colors shadow-soft"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading course catalog from backend..." />
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error loading courses</p>
              <p className="text-xs mt-1 text-rose-600">{error}</p>
            </div>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-soft">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Courses Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              We couldn't find any courses matching your filter query.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
              }}
              className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              const isOwner = user?.id && course.instructor?.id === user.id;

              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={isEnrolled}
                  isOwner={isOwner}
                  onEnroll={!isEnrolled && isStudent ? handleEnroll : null}
                  enrolling={enrollingCourseId === course.id}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

