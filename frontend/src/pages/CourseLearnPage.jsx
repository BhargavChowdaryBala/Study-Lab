import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { courseApi } from '../api/courseApi';
import { contentApi } from '../api/contentApi';
import { progressApi } from '../api/progressApi';
import { enrollmentApi } from '../api/enrollmentApi';
import { ContentViewer } from '../components/course/ContentViewer';
import { StudyLabTools } from '../components/studylab/StudyLabTools';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProgressBar } from '../components/common/ProgressBar';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  Award, 
  BookOpen,
  Menu,
  X,
  Sparkles,
  Download,
  Moon,
  Sun,
  Palette,
  Laptop
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export const CourseLearnPage = () => {
  const { courseId } = useParams();
  const { user, isStudent, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [enrollment, setEnrollment] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [completedContentIds, setCompletedContentIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Background Theme State: 'black' (Pure #000000 OLED), 'midnight' (#030712), 'slate' (#0f172a)
  const [bgTheme, setBgTheme] = useState(() => {
    return localStorage.getItem('studylab_bg_theme') || 'black';
  });

  const handleBgThemeChange = (theme) => {
    setBgTheme(theme);
    localStorage.setItem('studylab_bg_theme', theme);
    showToast(
      theme === 'black'
        ? 'Switched to Pure Black background (OLED Mode)'
        : theme === 'midnight'
        ? 'Switched to Midnight background'
        : 'Switched to Slate Dark background',
      'info'
    );
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadClassroomData();
  }, [courseId, isAuthenticated]);

  const loadClassroomData = async () => {
    setLoading(true);
    try {
      // 1. Load course details
      const courseData = await courseApi.getCourseById(courseId);
      setCourse(courseData);

      // 2. Load all contents
      const contentsData = await contentApi.getContentByCourse(courseId);
      setContents(contentsData || []);

      // 3. Load student enrollment
      if (isStudent) {
        const myEnrollments = await enrollmentApi.getMyEnrollments();
        const matchingEnrollment = (myEnrollments || []).find(
          (e) => e.course?.id === Number(courseId)
        );

        if (!matchingEnrollment) {
          showToast('You must be enrolled to view course materials in the Study Lab.', 'warning');
          navigate(`/courses/${courseId}`);
          return;
        }

        setEnrollment(matchingEnrollment);

        // 4. Load progress summary
        try {
          const summary = await progressApi.getMyProgressForCourse(courseId);
          setProgressSummary(summary);

          // 5. Load granular progress records
          const records = await progressApi.getProgressByEnrollment(matchingEnrollment.id);
          const completedIds = new Set(
            (records || [])
              .filter((r) => r.completed && r.content?.id)
              .map((r) => r.content.id)
          );
          setCompletedContentIds(completedIds);
        } catch (err) {
          console.warn('Could not load progress records:', err);
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to load Study Lab environment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!enrollment || contents.length === 0) return;
    const currentItem = contents[currentContentIndex];
    if (!currentItem) return;

    const isCurrentlyCompleted = completedContentIds.has(currentItem.id);
    setToggling(true);

    try {
      if (isCurrentlyCompleted) {
        // Mark incomplete
        await progressApi.markContentIncomplete(enrollment.id, currentItem.id);
        setCompletedContentIds((prev) => {
          const next = new Set(prev);
          next.delete(currentItem.id);
          return next;
        });
        showToast('Lesson marked as incomplete.', 'info');
      } else {
        // Mark complete
        await progressApi.markContentComplete(enrollment.id, currentItem.id);
        const nextCompleted = new Set(completedContentIds);
        nextCompleted.add(currentItem.id);
        setCompletedContentIds(nextCompleted);

        // Check if 100% complete
        if (nextCompleted.size >= contents.length) {
          confetti({
            particleCount: 140,
            spread: 80,
            origin: { y: 0.6 },
          });
          showToast('Congratulations! You completed all lessons in this course!', 'success');
          setShowCertificate(true);
        } else {
          showToast('Lesson marked complete! Keep learning!', 'success');
        }
      }

      // Refresh progress summary
      const updatedSummary = await progressApi.getProgressSummary(enrollment.id);
      setProgressSummary(updatedSummary);
    } catch (err) {
      showToast(err.message || 'Failed to update progress', 'error');
    } finally {
      setToggling(false);
    }
  };

  const goToNextLesson = () => {
    if (currentContentIndex < contents.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
    }
  };

  const goToPrevLesson = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${bgTheme === 'black' ? 'bg-black' : bgTheme === 'midnight' ? 'bg-[#030712]' : 'bg-slate-950'} py-20`}>
        <LoadingSpinner size="lg" text="Entering Study Lab environment..." />
      </div>
    );
  }

  const currentContent = contents[currentContentIndex] || null;
  const isCurrentCompleted = currentContent ? completedContentIds.has(currentContent.id) : false;
  const progressPercent = contents.length > 0
    ? Math.round((completedContentIds.size / contents.length) * 100)
    : 0;

  const isPureBlack = bgTheme === 'black';

  // Theme-dependent container styling
  const rootBgClass = isPureBlack
    ? 'bg-black text-neutral-100'
    : bgTheme === 'midnight'
    ? 'bg-[#030712] text-slate-100'
    : 'bg-slate-950 text-slate-100';

  const barBgClass = isPureBlack
    ? 'bg-black border-neutral-900'
    : bgTheme === 'midnight'
    ? 'bg-[#0b0f19] border-slate-800/80'
    : 'bg-slate-900 border-slate-800';

  const cardBgClass = isPureBlack
    ? 'bg-neutral-950 border-neutral-900'
    : 'bg-slate-900 border-slate-800';

  return (
    <div className={`min-h-screen ${rootBgClass} flex flex-col transition-colors duration-300`}>
      
      {/* Top Study Lab Bar */}
      <div className={`${barBgClass} border-b px-4 sm:px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-300`}>
        <div className="flex items-center gap-3">
          <Link
            to="/student/dashboard"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors shrink-0 border border-white/5"
            title="Back to Student Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider flex items-center gap-1">
                <Laptop className="w-3 h-3 text-brand-400" /> Study Lab
              </span>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                &bull; {course?.category || 'Curriculum'}
              </span>
            </div>
            <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {course?.title || 'Interactive Lesson'}
            </h1>
          </div>
        </div>

        {/* Right Action & Theme Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* THEME SELECTOR: Change background to pure black or dark options */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => handleBgThemeChange('black')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPureBlack
                  ? 'bg-white text-black shadow-soft'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Change Background to Pure Black (#000000)"
            >
              <div className="w-3 h-3 rounded-full bg-black border border-neutral-600" />
              <span className="hidden md:inline">Pure Black</span>
            </button>

            <button
              onClick={() => handleBgThemeChange('midnight')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                bgTheme === 'midnight'
                  ? 'bg-indigo-600 text-white shadow-soft'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Midnight Navy Background"
            >
              <div className="w-3 h-3 rounded-full bg-[#030712] border border-indigo-400" />
              <span className="hidden md:inline">Midnight</span>
            </button>

            <button
              onClick={() => handleBgThemeChange('slate')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                bgTheme === 'slate'
                  ? 'bg-slate-700 text-white shadow-soft'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Slate Dark Background"
            >
              <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-500" />
              <span className="hidden md:inline">Slate</span>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="hidden lg:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Progress</p>
              <p className="text-xs font-bold text-brand-300">{progressPercent}% Done</p>
            </div>
            <div className="w-16">
              <ProgressBar percentage={progressPercent} size="sm" showLabel={false} />
            </div>
          </div>

          {/* Certificate Button */}
          {progressPercent === 100 && (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-soft transition-all"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Certificate</span>
            </button>
          )}

          {/* Mobile Syllabus Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Layout: Split Media Viewer & Syllabus Sidebar */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Column: Media Player, Controls, & Study Lab Suite */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Viewer Component */}
            <ContentViewer
              content={currentContent}
              isCompleted={isCurrentCompleted}
              onToggleComplete={handleToggleComplete}
              toggling={toggling}
            />

            {/* Navigation & Controls Bar */}
            <div className={`flex items-center justify-between gap-4 p-4 rounded-2xl border ${cardBgClass} transition-colors duration-300`}>
              <button
                onClick={goToPrevLesson}
                disabled={currentContentIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>

              <span className="text-xs font-semibold text-slate-400">
                Lesson {currentContentIndex + 1} of {contents.length}
              </span>

              <button
                onClick={goToNextLesson}
                disabled={currentContentIndex === contents.length - 1}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/5"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Study Lab Tools Suite: Notes, Code Scratchpad, Pomodoro Timer */}
            <StudyLabTools
              courseId={courseId}
              lessonId={currentContent?.id}
              isPureBlack={isPureBlack}
            />
          </div>
        </div>

        {/* Right Column: Syllabus Playlist Sidebar */}
        <div
          className={`w-full lg:w-80 border-l flex flex-col shrink-0 ${barBgClass} ${
            sidebarOpen ? 'block' : 'hidden lg:flex'
          } transition-colors duration-300`}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                <span>Curriculum Playlist</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {completedContentIds.size} / {contents.length} Completed
              </p>
            </div>
            <span className="text-xs font-bold text-brand-400">{progressPercent}%</span>
          </div>

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2">
            {contents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No syllabus items published.
              </div>
            ) : (
              contents.map((item, index) => {
                const isSelected = index === currentContentIndex;
                const isDone = completedContentIds.has(item.id);
                const type = (item.contenttype || '').toUpperCase();

                return (
                  <button
                    key={item.id || index}
                    onClick={() => {
                      setCurrentContentIndex(index);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 my-1 ${
                      isSelected
                        ? 'bg-brand-600/25 border border-brand-500/40 text-white'
                        : 'hover:bg-white/5 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold truncate">
                          Lesson {index + 1}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 px-1.5 py-0.5 bg-black/40 rounded border border-white/5">
                          {type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate font-mono">
                        {item.contenturl}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Completion Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-10 max-w-2xl w-full text-center relative shadow-elevated">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Layout */}
            <div className="p-8 border-4 border-double border-amber-500/40 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950 text-white relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Award className="w-9 h-9" />
              </div>
              <p className="text-xs uppercase font-extrabold tracking-widest text-amber-400 mb-1">
                Certificate of Achievement
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                Course Completion Award
              </h2>
              <p className="text-xs text-slate-400 mb-6">This document certifies that</p>

              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 mb-2">
                {user?.name || 'Student Candidate'}
              </h3>

              <p className="text-xs text-slate-400 mb-4">has successfully fulfilled all curriculum requirements for</p>

              <p className="text-lg font-extrabold text-brand-300 mb-6">
                "{course?.title}"
              </p>

              <div className="flex justify-between items-end pt-6 border-t border-slate-800 text-xs text-slate-400">
                <div className="text-left">
                  <p className="font-semibold text-slate-300">Instructor: {course?.instructor?.name || 'Lead Instructor'}</p>
                  <p className="text-[11px] text-slate-500">Verified Platform Signature</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-300">Issued: {new Date().toLocaleDateString()}</p>
                  <p className="text-[11px] text-emerald-400 font-semibold">Status: VERIFIED & COMPLETED</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-soft"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
