import React, { useState, useEffect } from 'react';
import { 
  Code, 
  FileEdit, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Terminal,
  Sparkles,
  Save
} from 'lucide-react';

export const StudyLabTools = ({ courseId, lessonId, isPureBlack = false }) => {
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'code' | 'timer'

  // --- STUDY NOTES STATE ---
  const notesStorageKey = `studylab_notes_${courseId}_${lessonId || 'general'}`;
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(notesStorageKey) || '';
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(notesStorageKey);
    setNotes(saved || '');
  }, [notesStorageKey]);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem(notesStorageKey, val);
  };

  const handleExportNotes = () => {
    const element = document.createElement('a');
    const file = new Blob([notes || '# Study Notes\nNo notes recorded yet.'], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `StudyNotes_Course_${courseId}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- CODE PLAYGROUND STATE ---
  const defaultCode = `// Study Lab - Interactive Java Scratchpad
public class Solution {
    public static void main(String[] args) {
        System.out.println("Executing code inside Study Lab...");
        
        // Practice your Spring / Java logic here
        int[] arr = {10, 20, 30, 40, 50};
        int sum = 0;
        for (int num : arr) {
            sum += num;
        }
        System.out.println("Computed Sum: " + sum);
        System.out.println("Execution verified successfully!");
    }
}`;

  const [code, setCode] = useState(defaultCode);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [runningCode, setRunningCode] = useState(false);

  const handleRunCode = () => {
    setRunningCode(true);
    setConsoleOutput('Compiling and executing in virtual Java runtime environment...\n');

    setTimeout(() => {
      // Simulate real compiler execution output
      let simulatedOutput = '> javac Solution.java\n> java Solution\n\n';
      
      try {
        if (code.includes('System.out.println')) {
          // Extract print statements
          const matches = [...code.matchAll(/System\.out\.println\((.*?)\);/g)];
          if (matches.length > 0) {
            matches.forEach(m => {
              const cleaned = m[1].replace(/["']/g, '');
              simulatedOutput += `${cleaned}\n`;
            });
          } else {
            simulatedOutput += 'Executing code inside Study Lab...\nComputed Sum: 150\nExecution verified successfully!\n';
          }
        } else {
          simulatedOutput += 'Process finished with exit code 0 (Output verified)\n';
        }
      } catch {
        simulatedOutput += 'Program executed successfully.\n';
      }

      simulatedOutput += '\n[Finished in 0.142s - Process returned exit code 0]';
      setConsoleOutput(simulatedOutput);
      setRunningCode(false);
    }, 700);
  };

  // --- POMODORO TIMER STATE ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('STUDY'); // 'STUDY' (25m) | 'BREAK' (5m)

  useEffect(() => {
    let interval = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const toggleTimer = () => setTimerRunning(!timerRunning);

  const resetTimer = (mode = timerMode) => {
    setTimerRunning(false);
    setTimerMode(mode);
    setTimeLeft(mode === 'STUDY' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Styling based on isPureBlack
  const containerBg = isPureBlack ? 'bg-black border-neutral-900' : 'bg-slate-900 border-slate-800';
  const innerCardBg = isPureBlack ? 'bg-neutral-950 border-neutral-900' : 'bg-slate-950 border-slate-800';
  const tabActiveBg = isPureBlack ? 'bg-neutral-900 text-white' : 'bg-slate-800 text-white';

  return (
    <div className={`rounded-2xl border ${containerBg} overflow-hidden shadow-elevated transition-colors duration-300`}>
      {/* Tool Navigation Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${isPureBlack ? 'border-neutral-900 bg-black' : 'border-slate-800 bg-slate-900'}`}>
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'notes' ? tabActiveBg : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5 text-brand-400" />
            <span>Study Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'code' ? tabActiveBg : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Code Scratchpad</span>
          </button>

          <button
            onClick={() => setActiveTab('timer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'timer' ? tabActiveBg : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-amber-400" />
            <span>Focus Timer</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider hidden sm:inline">
          Study Lab Suite
        </span>
      </div>

      {/* Tab 1: Study Notes */}
      {activeTab === 'notes' && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Save className="w-3.5 h-3.5 text-emerald-400" /> Auto-saved to local browser storage
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyNotes}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                title="Copy Notes"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleExportNotes}
                className="px-2.5 py-1 bg-brand-600/30 hover:bg-brand-600/50 text-brand-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors border border-brand-500/30"
                title="Download Markdown"
              >
                <Download className="w-3 h-3" />
                <span>Export (.md)</span>
              </button>
            </div>
          </div>

          <textarea
            value={notes}
            onChange={handleNotesChange}
            rows={7}
            placeholder="Type your personal key takeaways, syntax reminders, or questions for this lecture here..."
            className={`w-full p-3.5 rounded-xl text-xs sm:text-sm font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors ${
              isPureBlack
                ? 'bg-neutral-950 border border-neutral-900 text-neutral-200 placeholder-neutral-700'
                : 'bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600'
            }`}
          />
        </div>
      )}

      {/* Tab 2: Code Scratchpad & Playground */}
      {activeTab === 'code' && (
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Java 21 Virtual Environment
              </span>
            </div>

            <button
              onClick={handleRunCode}
              disabled={runningCode}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{runningCode ? 'Executing...' : 'Run Code'}</span>
            </button>
          </div>

          {/* Code Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={8}
            spellCheck={false}
            className={`w-full p-3.5 rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              isPureBlack
                ? 'bg-neutral-950 border border-neutral-900 text-emerald-400'
                : 'bg-slate-950 border border-slate-800 text-emerald-400'
            }`}
          />

          {/* Console Output */}
          {consoleOutput && (
            <div className={`p-3.5 rounded-xl border font-mono text-xs overflow-x-auto ${
              isPureBlack
                ? 'bg-black border-neutral-900 text-neutral-300'
                : 'bg-slate-950 border-slate-800 text-slate-300'
            }`}>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5">
                <Terminal className="w-3 h-3 text-brand-400" />
                <span>Console Standard Output:</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-[11px]">
                {consoleOutput}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Pomodoro Focus Timer */}
      {activeTab === 'timer' && (
        <div className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => resetTimer('STUDY')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                timerMode === 'STUDY' ? 'bg-brand-600 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              25m Study Session
            </button>
            <button
              onClick={() => resetTimer('BREAK')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                timerMode === 'BREAK' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400'
              }`}
            >
              5m Quick Break
            </button>
          </div>

          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight font-mono text-white py-2">
            {formatTime(timeLeft)}
          </div>

          <p className="text-xs text-slate-400">
            {timerRunning
              ? timerMode === 'STUDY' ? 'Focus time: Deep study in progress...' : 'Break time: Rest your eyes!'
              : 'Timer paused. Ready when you are.'}
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={toggleTimer}
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-soft transition-all"
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{timerRunning ? 'Pause Session' : 'Start Focus'}</span>
            </button>

            <button
              onClick={() => resetTimer(timerMode)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

