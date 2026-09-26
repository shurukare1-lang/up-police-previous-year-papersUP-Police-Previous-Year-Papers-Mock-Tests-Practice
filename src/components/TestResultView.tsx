import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAllQuestions } from '../data/papersData';
import { Question, SubjectType } from '../types';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Target, 
  RotateCcw, 
  Layers, 
  BookOpen, 
  Bookmark, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Share2,
  FileText
} from 'lucide-react';

export const TestResultView: React.FC = () => {
  const { 
    latestAttempt, 
    setCurrentView, 
    startMockTest, 
    activePaper,
    language,
    bookmarks,
    toggleBookmarkItem,
    removeWrongItem
  } = useApp();

  const [questionFilter, setQuestionFilter] = useState<'all' | 'correct' | 'incorrect' | 'unattempted'>('all');
  const [expandedExplanation, setExpandedExplanation] = useState<Record<string, boolean>>({});

  if (!latestAttempt) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
        <p className="text-base font-bold text-white mb-2">No test result available.</p>
        <button
          type="button"
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-sm"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const allQuestions = getAllQuestions();
  // Find questions corresponding to this attempt
  const testQuestions: Question[] = Object.keys(latestAttempt.answers)
    .concat(Object.keys(latestAttempt.statuses))
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(id => allQuestions.find(q => q.id === id))
    .filter((q): q is Question => q !== undefined);

  // Fallback to activePaper questions if needed
  const finalQuestions = testQuestions.length > 0 ? testQuestions : (activePaper ? activePaper.questions : []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const toggleExplanation = (qId: string) => {
    setExpandedExplanation(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Filtered questions for detailed review
  const filteredReviewQuestions = finalQuestions.filter(q => {
    const selected = latestAttempt.answers[q.id];
    if (questionFilter === 'correct') {
      return selected !== undefined && selected === q.correctOption;
    }
    if (questionFilter === 'incorrect') {
      return selected !== undefined && selected !== q.correctOption;
    }
    if (questionFilter === 'unattempted') {
      return selected === undefined;
    }
    return true;
  });

  const isPassed = latestAttempt.maxScore > 0 && (latestAttempt.score / latestAttempt.maxScore) >= 0.5;

  return (
    <div className="space-y-6">
      
      {/* Score Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-100 shadow-sm">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>OFFICIAL SCORECARD & PERFORMANCE REPORT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {latestAttempt.paperTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Attempted on {new Date(latestAttempt.timestamp).toLocaleDateString('hi-IN', { dateStyle: 'full' })} at {new Date(latestAttempt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {activePaper && (
              <button
                type="button"
                onClick={() => startMockTest(activePaper)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Attempt Test</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setCurrentView('dashboard')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Primary Metrics Grid (NO STATIC PILLS) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-5">
          
          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Total Score</span>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 mt-1">
              {latestAttempt.score.toFixed(1)}
              <span className="text-xs font-normal text-slate-400 ml-1">/ {latestAttempt.maxScore}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {latestAttempt.maxScore > 0 ? ((latestAttempt.score / latestAttempt.maxScore) * 100).toFixed(1) : 0}% marks
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Accuracy</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
              {latestAttempt.accuracy}%
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {latestAttempt.correctCount} / {latestAttempt.correctCount + latestAttempt.incorrectCount} attempted
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Correct Answers</span>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" />
              <span>{latestAttempt.correctCount}</span>
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-0.5 block font-mono">
              +{(latestAttempt.correctCount * (latestAttempt.category === 'constable' ? 2 : 2.5)).toFixed(1)} marks
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Incorrect Answers</span>
            <div className="text-xl sm:text-2xl font-bold text-rose-400 mt-1 flex items-center gap-1.5">
              <XCircle className="w-5 h-5" />
              <span>{latestAttempt.incorrectCount}</span>
            </div>
            <span className="text-[11px] text-rose-400/80 mt-0.5 block font-mono">
              -{(latestAttempt.incorrectCount * (latestAttempt.category === 'constable' ? 0.5 : 0)).toFixed(1)} penalty
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Unattempted</span>
            <div className="text-xl sm:text-2xl font-bold text-slate-300 mt-1 flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <span>{latestAttempt.unattemptedCount}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Skipped questions
            </span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-xs text-slate-400">Time Taken</span>
            <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-1 flex items-center gap-1.5 font-mono">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>{formatTime(latestAttempt.timeTakenSeconds)}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Avg ~{Math.round(latestAttempt.timeTakenSeconds / Math.max(1, finalQuestions.length))}s / question
            </span>
          </div>

        </div>

      </div>

      {/* Sectional Cutoff & Breakdown (Especially important for UPSI 35% cutoff) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Section-wise Breakdown & Cutoff Status (अनुभागवार प्रदर्शन)</span>
          </h2>
          {latestAttempt.category === 'upsi' && (
            <span className="text-xs text-amber-400 font-medium">
              *UPSI Rule: 35% minimum qualifying score required in each section
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {Object.entries(latestAttempt.sectionalScores)
            .filter(([_, stats]) => stats.maxScore > 0)
            .map(([subjKey, stats]) => {
              const scorePct = stats.maxScore > 0 ? Math.round((stats.score / stats.maxScore) * 100) : 0;
              const hasCutoff = latestAttempt.category === 'upsi';
              const passedCutoff = scorePct >= 35;

              return (
                <div key={subjKey} className="bg-slate-800/70 p-3.5 rounded-lg border border-slate-700/80">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold text-slate-200">
                      {subjKey === 'gk' && 'सामान्य ज्ञान (GK)'}
                      {subjKey === 'hindi' && 'सामान्य हिन्दी / भाषा I'}
                      {subjKey === 'maths' && 'गणित व शिक्षणशास्त्र (Maths)'}
                      {subjKey === 'reasoning' && 'तार्किक क्षमता (Reasoning)'}
                      {subjKey === 'mool_vidhi' && 'मूलविधि व संविधान (Law)'}
                      {subjKey === 'cdp' && 'बाल विकास व शिक्षाशास्त्र (CDP)'}
                      {subjKey === 'evs' && 'पर्यावरण अध्ययन (EVS)'}
                      {subjKey === 'english' && 'अंग्रेजी भाषा / भाषा II'}
                      {subjKey === 'science' && 'विज्ञान व शिक्षणशास्त्र (Science)'}
                      {subjKey === 'social_studies' && 'सामाजिक अध्ययन व शिक्षण (SST)'}
                    </span>
                    {hasCutoff && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                        passedCutoff 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                          : 'bg-rose-950 text-rose-300 border-rose-700'
                      }`}>
                        {passedCutoff ? 'PASSED 35%' : 'FAILED CUTOFF'}
                      </span>
                    )}
                  </div>

                  <div className="text-lg font-bold text-white mt-1.5">
                    {stats.score.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ {stats.maxScore}</span>
                  </div>

                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${scorePct >= 60 ? 'bg-emerald-500' : scorePct >= 35 ? 'bg-amber-400' : 'bg-rose-500'}`}
                      style={{ width: `${Math.min(100, Math.max(0, scorePct))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="text-emerald-400">{stats.correct} Correct</span>
                    <span className="text-rose-400">{stats.incorrect} Wrong</span>
                    <span>{stats.unattempted} Skipped</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Question-by-Question Detailed Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Question-by-Question Solution & Analysis (विस्तृत प्रश्न विश्लेषण)
            </h2>
            <p className="text-xs text-slate-400 font-hindi mt-0.5">
              प्रत्येक प्रश्न का सही उत्तर, आपका चयनित विकल्प एवं परीक्षा-उन्मुख विस्तृत स्पष्टीकरण देखें।
            </p>
          </div>

          {/* Review Filter Tabs (Buttons) */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setQuestionFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                questionFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              All ({finalQuestions.length})
            </button>
            <button
              type="button"
              onClick={() => setQuestionFilter('correct')}
              className={`px-2.5 py-1 rounded transition-colors ${
                questionFilter === 'correct' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Correct ({latestAttempt.correctCount})
            </button>
            <button
              type="button"
              onClick={() => setQuestionFilter('incorrect')}
              className={`px-2.5 py-1 rounded transition-colors ${
                questionFilter === 'incorrect' ? 'bg-rose-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Incorrect ({latestAttempt.incorrectCount})
            </button>
            <button
              type="button"
              onClick={() => setQuestionFilter('unattempted')}
              className={`px-2.5 py-1 rounded transition-colors ${
                questionFilter === 'unattempted' ? 'bg-slate-700 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Skipped ({latestAttempt.unattemptedCount})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4 pt-1">
          {filteredReviewQuestions.map((q, idx) => {
            const selectedOpt = latestAttempt.answers[q.id];
            const isCorrect = selectedOpt !== undefined && selectedOpt === q.correctOption;
            const isUnattempted = selectedOpt === undefined;
            const isExpanded = expandedExplanation[q.id] !== false; // expanded by default

            return (
              <div 
                key={q.id}
                className={`rounded-lg border p-4 transition-all ${
                  isCorrect 
                    ? 'bg-slate-900/90 border-emerald-900/50' 
                    : isUnattempted
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-slate-900/90 border-rose-900/50'
                }`}
              >
                {/* Question Metadata Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      isCorrect 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : isUnattempted
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {q.questionNumber || idx + 1}
                    </span>
                    <span className="font-medium text-slate-300">
                      {language === 'en' ? q.subjectNameEn : q.subjectNameHi}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400">
                      {language === 'en' ? q.topic : q.topicHi}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-amber-400 font-medium">{q.difficulty}</span>
                  </div>

                  {/* Status Indicator & Bookmark */}
                  <div className="flex items-center gap-2">
                    {isCorrect && (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct (+{latestAttempt.category === 'constable' ? '2.0' : '2.5'})</span>
                      </span>
                    )}
                    {!isCorrect && !isUnattempted && (
                      <span className="text-rose-400 flex items-center gap-1 font-semibold text-xs">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Wrong (-{latestAttempt.category === 'constable' ? '0.5' : '0.0'})</span>
                      </span>
                    )}
                    {isUnattempted && (
                      <span className="text-slate-400 flex items-center gap-1 text-xs">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Unattempted (0.0)</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleBookmarkItem(q.id)}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                        bookmarks.includes(q.id) ? 'text-amber-400' : 'text-slate-400'
                      }`}
                      title="Bookmark Question"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(q.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-medium text-slate-100 my-3 leading-relaxed font-hindi">
                  {language === 'en' ? q.textEn : q.textHi}
                </div>

                {/* Options Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                  {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => {
                    const isChosen = selectedOpt === optIdx;
                    const isOfficialCorrect = q.correctOption === optIdx;
                    const optText = language === 'en' ? q.optionsEn[optIdx] : q.optionsHi[optIdx];

                    let optBg = 'bg-slate-800/40 border-slate-700/60 text-slate-300';
                    let badge = optLabel;

                    if (isOfficialCorrect) {
                      optBg = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 ring-1 ring-emerald-500/50';
                    } else if (isChosen && !isOfficialCorrect) {
                      optBg = 'bg-rose-950/40 border-rose-500/60 text-rose-200 ring-1 ring-rose-500/50';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${optBg}`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          isOfficialCorrect
                            ? 'bg-emerald-500 text-slate-950'
                            : isChosen
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {badge}
                        </span>

                        <div className="flex-1">
                          <span className="font-hindi">{optText}</span>
                          {isOfficialCorrect && (
                            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                              ✓ Official Correct Answer
                            </span>
                          )}
                          {isChosen && !isOfficialCorrect && (
                            <span className="text-[10px] text-rose-400 font-bold block mt-0.5">
                              ✕ Your Selected Option
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Reveal */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => toggleExplanation(q.id)}
                    className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold mb-2"
                  >
                    <span>{isExpanded ? 'Hide Detailed Solution' : 'View Detailed Solution & Explanation'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700 text-xs text-slate-200 space-y-1.5 font-hindi leading-relaxed">
                      <div>
                        <strong className="text-amber-400">विस्तृत व्याख्या: </strong>
                        <span>{q.explanationHi}</span>
                      </div>
                      {language === 'bilingual' && (
                        <div className="pt-1 text-slate-400 text-[11px] font-sans">
                          <strong className="text-slate-300">English Solution: </strong>
                          <span>{q.explanationEn}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
