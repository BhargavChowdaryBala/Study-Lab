import React, { useState } from 'react';
import { 
  Play, 
  FileText, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Video,
  Download,
  BookOpen
} from 'lucide-react';

export const ContentViewer = ({ 
  content, 
  isCompleted = false, 
  onToggleComplete = null,
  toggling = false 
}) => {
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!content) {
    return (
      <div className="bg-slate-900 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center justify-center min-h-[420px]">
        <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
        <h4 className="text-lg font-bold text-slate-200">No Content Selected</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Please select a lecture, PDF, or quiz from the curriculum panel on the right.
        </p>
      </div>
    );
  }

  const contentType = (content.contenttype || '').toUpperCase();
  const url = content.contenturl || '';

  // Helper to parse YouTube URL to embed format
  const getEmbedUrl = (rawUrl) => {
    if (!rawUrl) return '';
    try {
      if (rawUrl.includes('youtube.com/watch')) {
        const urlParams = new URL(rawUrl).searchParams;
        const videoId = urlParams.get('v');
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
      if (rawUrl.includes('youtu.be/')) {
        const videoId = rawUrl.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
      }
      if (rawUrl.includes('vimeo.com/')) {
        const videoId = rawUrl.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return rawUrl;
    } catch {
      return rawUrl;
    }
  };

  const isEmbeddableVideo = url.includes('youtube') || url.includes('youtu.be') || url.includes('vimeo');
  const isDirectVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mkv');

  return (
    <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-elevated border border-slate-800">
      {/* Top Media Display Area */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        {contentType === 'VIDEO' ? (
          isEmbeddableVideo ? (
            <iframe
              src={getEmbedUrl(url)}
              title="Course Video Lecture"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isDirectVideo ? (
            <video
              controls
              className="w-full h-full object-contain"
              src={url}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-slate-300">
              <Video className="w-16 h-16 text-brand-400 mb-3 animate-pulse" />
              <h4 className="text-base font-bold text-white mb-2">Video Lecture Stream</h4>
              <p className="text-xs text-slate-400 max-w-md mb-4 truncate font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                {url}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-soft"
              >
                <span>Open Video in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )
        ) : contentType === 'PDF' ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-900/90">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Course PDF Material & Notes</h4>
            <p className="text-xs text-slate-400 max-w-md mb-4 truncate font-mono bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              {url}
            </p>
            <div className="flex gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-soft"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open / Download PDF Document</span>
              </a>
            </div>
          </div>
        ) : (
          /* QUIZZ Module */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white overflow-y-auto">
            <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-elevated">
              <div className="flex items-center gap-2.5 mb-4 text-brand-400">
                <HelpCircle className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Concept Check Quiz</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-4">
                Did you grasp the core principles covered in this module?
              </h4>
              <div className="space-y-2 mb-4">
                {['Yes, thoroughly understood', 'Reviewed key concepts and code snippets', 'Need to review lecture once more'].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedQuizOption(i);
                      setQuizSubmitted(true);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                      selectedQuizOption === i
                        ? 'border-brand-500 bg-brand-500/20 text-white'
                        : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {quizSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Answer recorded! Click "Mark as Completed" below to advance.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
            #{content.sequenceOrder || 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-brand-400 tracking-wider">
                {contentType}
              </span>
              <span className="text-xs text-slate-500">&bull;</span>
              <span className="text-xs text-slate-300 truncate max-w-xs font-mono">
                {url}
              </span>
            </div>
          </div>
        </div>

        {/* Completion Toggle Button */}
        {onToggleComplete && (
          <button
            onClick={onToggleComplete}
            disabled={toggling}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-soft ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-brand-600 hover:bg-brand-500 text-white'
            }`}
          >
            <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-brand-200'}`} />
            <span>
              {toggling
                ? 'Updating...'
                : isCompleted
                ? 'Completed (Click to Undo)'
                : 'Mark as Completed'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

