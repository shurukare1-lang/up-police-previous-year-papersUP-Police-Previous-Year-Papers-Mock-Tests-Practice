import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Question, QuestionStatus, SubjectType, TestAttempt } from '../types';
import { 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Check, 
  RotateCcw, 
  Send, 
  HelpCircle,
  Eye,
  Languages,
  Shield,
  Layers,
  Flag,
  CheckCircle2,
  X
} from 'lucide-react';

export const MockTestEngine: React.FC = () => {
  const { 
    activePaper, 
    activeTestQuestions, 
    activeTestTitle, 
    activeTestTitleHi,
    activeTestDurationMinutes, 
    activeMarking,
    finishTest, 
    setCurrentView,
    language,
    selectedCategory,
    bookmarks,
    toggleBookmarkItem
  } = useApp();

  const questions = activeTestQuestions;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [questionStatuses, setQuestionStatuses] = useState<Record<string, QuestionStatus>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(activeTestDurationMinutes * 60);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [localQuestionLang, setLocalQuestionLang] = useState<'hi' | 'en'>('hi');
  const [activeSectionFilter, setActiveSectionFilter] = useState<SubjectType | 'all'>('all');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Initialize statuses
  useEffect(() => {
    const initialStatuses: Record<string, QuestionStatus> = {};
    questions.forEach((q, idx) => {
      initialStatuses[q.id] = idx === 0 ? 'not_answered' : 'unvisited';
    });
    setQuestionStatuses(initialStatuses);
  }, [questions]);

  // Set default language based on context
  useEffect(() => {
    if (language === 'en') {
      setLocalQuestionLang('en');
    } else {
      setLocalQuestionLang('hi');
    }
  }, [language]);

  // Timer countdown & Auto-submit
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userAnswers, questionStatuses]);

  const currentQ: Question | undefined = questions[currentIndex];

  if (!currentQ || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
        <p className="text-lg font-bold text-white mb-2">No questions available for this test.</p>
        <button
          type="button"
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const formatTimer = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemainingSeconds < 300; // < 5 mins

  // Option selection
  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  // Clear current response
  const handleClearResponse = () => {
    setUserAnswers(prev => {
      const next = { ...prev };
      delete next[currentQ.id];
      return next;
    });
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: 'not_answered'
    }));
  };

  // Save and Next
  const handleSaveAndNext = () => {
    const hasAnswer = userAnswers[currentQ.id] !== undefined;
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: hasAnswer ? 'answered' : 'not_answered'
    }));

    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      if (questionStatuses[nextQ.id] === 'unvisited') {
        setQuestionStatuses(prev => ({
          ...prev,
          [nextQ.id]: 'not_answered'
        }));
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    const hasAnswer = userAnswers[currentQ.id] !== undefined;
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQ.id]: hasAnswer ? 'answered_marked' : 'marked'
    }));

    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      if (questionStatuses[nextQ.id] === 'unvisited') {
        setQuestionStatuses(prev => ({
          ...prev,
          [nextQ.id]: 'not_answered'
        }));
      }
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Jump directly to a question
  const handleJumpToQuestion = (index: number) => {
    // Current question status update if not yet set
    const hasAnswer = userAnswers[currentQ.id] !== undefined;
    const currentStatus = questionStatuses[currentQ.id];
    if (currentStatus === 'unvisited' || currentStatus === 'not_answered') {
      setQuestionStatuses(prev => ({
        ...prev,
        [currentQ.id]: hasAnswer ? 'answered' : 'not_answered'
      }));
    }

    const targetQ = questions[index];
    if (questionStatuses[targetQ.id] === 'unvisited') {
      setQuestionStatuses(prev => ({
        ...prev,
        [targetQ.id]: 'not_answered'
      }));
    }
    setCurrentIndex(index);
  };

  // Auto submit when time expires
  const handleAutoSubmit = () => {
    processAndSubmit();
  };

  // Calculate scores and finalize attempt
  const processAndSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const timeTakenSeconds = Math.max(1, (activeTestDurationMinutes * 60) - timeRemainingSeconds);
    const positiveMarks = activeMarking.positive;
    const negativeMarks = activeMarking.negative;

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const sectionalScores: TestAttempt['sectionalScores'] = {
      gk: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      hindi: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      maths: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      reasoning: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      mool_vidhi: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      cdp: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      evs: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      english: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      science: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 },
      social_studies: { correct: 0, incorrect: 0, unattempted: 0, score: 0, maxScore: 0 }
    };

    const topicStats: Record<string, { correct: number; incorrect: number; total: number }> = {};

    questions.forEach(q => {
      const selected = userAnswers[q.id];
      const subj = q.subject;

      sectionalScores[subj].maxScore += positiveMarks;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { correct: 0, incorrect: 0, total: 0 };
      }
      topicStats[q.topic].total += 1;

      if (selected === undefined) {
        unattemptedCount++;
        sectionalScores[subj].unattempted++;
      } else if (selected === q.correctOption) {
        correctCount++;
        sectionalScores[subj].correct++;
        sectionalScores[subj].score += positiveMarks;
        topicStats[q.topic].correct += 1;
      } else {
        incorrectCount++;
        sectionalScores[subj].incorrect++;
        sectionalScores[subj].score -= negativeMarks;
        topicStats[q.topic].incorrect += 1;
      }
    });

    const totalRawScore = (correctCount * positiveMarks) - (incorrectCount * negativeMarks);
    const finalScore = Math.max(0, parseFloat(totalRawScore.toFixed(2)));
    const maxScore = questions.length * positiveMarks;
    const attemptedCount = correctCount + incorrectCount;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    // Check sectional cutoffs (especially for UPSI 35%)
    if (activeMarking.sectionalCutoffPercent) {
      const requiredRatio = activeMarking.sectionalCutoffPercent / 100;
      Object.keys(sectionalScores).forEach((subKey) => {
        const s = sectionalScores[subKey as SubjectType];
        if (s.maxScore > 0) {
          s.passed = (s.score / s.maxScore) >= requiredRatio;
        }
      });
    }

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      paperId: activePaper ? activePaper.id : 'custom-pyq-test',
      paperTitle: activeTestTitle || 'UP Police Mock Test',
      category: activePaper ? activePaper.category : selectedCategory,
      timestamp: Date.now(),
      timeTakenSeconds,
      answers: userAnswers,
      statuses: questionStatuses,
      score: finalScore,
      maxScore,
      correctCount,
      incorrectCount,
      unattemptedCount,
      accuracy,
      sectionalScores,
      topicStats
    };

    finishTest(attempt);
  };

  // Status counts for palette
  const answeredCount = Object.values(questionStatuses).filter(s => s === 'answered').length;
  const notAnsweredCount = Object.values(questionStatuses).filter(s => s === 'not_answered').length;
  const markedCount = Object.values(questionStatuses).filter(s => s === 'marked').length;
  const answeredMarkedCount = Object.values(questionStatuses).filter(s => s === 'answered_marked').length;
  const unvisitedCount = questions.length - (answeredCount + notAnsweredCount + markedCount + answeredMarkedCount);

  // Filter questions by section if needed
  const sections: Array<{ id: SubjectType | 'all'; labelHi: string; labelEn: string }> = selectedCategory === 'ctet' ? [
    { id: 'all', labelHi: 'सभी विषय (All Subjects)', labelEn: 'All Subjects' },
    { id: 'cdp', labelHi: 'बाल विकास (CDP)', labelEn: 'Child Dev & Pedagogy' },
    { id: 'maths', labelHi: 'गणित (Maths)', labelEn: 'Mathematics & Pedagogy' },
    { id: 'evs', labelHi: 'पर्यावरण (EVS)', labelEn: 'Environmental Studies' },
    { id: 'hindi', labelHi: 'हिन्दी भाषा (Hindi)', labelEn: 'Language I (Hindi)' },
    { id: 'english', labelHi: 'अंग्रेजी (English)', labelEn: 'Language II (English)' },
    { id: 'science', labelHi: 'विज्ञान (Science)', labelEn: 'Science & Pedagogy' },
    { id: 'social_studies', labelHi: 'सामाजिक अध्ययन (SST)', labelEn: 'Social Studies / Science' }
  ] : [
    { id: 'all', labelHi: 'सभी अनुभाग (All)', labelEn: 'All Sections' },
    { id: 'gk', labelHi: 'सामान्य ज्ञान (GK)', labelEn: 'General Knowledge' },
    { id: 'hindi', labelHi: 'सामान्य हिन्दी (Hindi)', labelEn: 'General Hindi' },
    { id: 'maths', labelHi: 'संख्यात्मक (Maths)', labelEn: 'Maths / Numerical' },
    { id: 'reasoning', labelHi: 'तार्किक क्षमता (Reasoning)', labelEn: 'Reasoning' },
    ...(selectedCategory === 'upsi' ? [{ id: 'mool_vidhi' as SubjectType, labelHi: 'मूलविधि व संविधान (Law)', labelEn: 'Law & Constitution' }] : [])
  ];

  return (
    <div className="space-y-4">
      
      {/* Test Header Bar with Timer & Exam Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 text-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-16 z-30 shadow-md">
        
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {language === 'en' ? activeTestTitle : activeTestTitleHi || activeTestTitle}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Q {currentIndex + 1} of {questions.length}</span>
              <span>·</span>
              <span className="text-amber-400">+{activeMarking.positive} / -{activeMarking.negative} Marks</span>
              {activePaper && (
                <>
                  <span>·</span>
                  <span className="font-mono text-[11px] text-slate-400">{activePaper.paperCode}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Timer & Submit Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          
          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm sm:text-base font-bold ${
            isLowTime 
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 animate-pulse' 
              : 'bg-slate-800 border-slate-700 text-amber-300'
          }`}>
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>

          {/* Question Language Switcher inside test */}
          <button
            type="button"
            onClick={() => setLocalQuestionLang(prev => prev === 'hi' ? 'en' : 'hi')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors font-medium"
            title="भाषा बदलें (Toggle Language)"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{localQuestionLang === 'hi' ? 'ENG' : 'हिन्दी'}</span>
          </button>

          {/* Submit Test Button */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Question Area (Left) + Palette (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Question Area */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Section Selector Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-xs bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
            {sections.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSectionFilter(s.id)}
                className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                  activeSectionFilter === s.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {localQuestionLang === 'en' ? s.labelEn : s.labelHi}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-100 shadow-sm space-y-5">
            
            {/* Question Header & Subject metadata */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Q. {currentQ.questionNumber || currentIndex + 1}
                </span>
                <span className="text-slate-400 font-medium">
                  {localQuestionLang === 'en' ? currentQ.subjectNameEn : currentQ.subjectNameHi}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-400">
                  {localQuestionLang === 'en' ? currentQ.topic : currentQ.topicHi}
                </span>
              </div>

              {/* Bookmark Question */}
              <button
                type="button"
                onClick={() => toggleBookmarkItem(currentQ.id)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  bookmarks.includes(currentQ.id)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(currentQ.id) ? 'fill-current' : ''}`} />
                <span>{bookmarks.includes(currentQ.id) ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed whitespace-pre-line font-hindi">
              {localQuestionLang === 'en' ? currentQ.textEn : currentQ.textHi}
            </div>

            {/* If Bilingual mode is preferred, show alternate text softly */}
            {language === 'bilingual' && (
              <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800 text-xs text-slate-400 whitespace-pre-line">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {localQuestionLang === 'hi' ? 'English Translation:' : 'हिन्दी अनुवाद:'}
                </span>
                {localQuestionLang === 'hi' ? currentQ.textEn : currentQ.textHi}
              </div>
            )}

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                const optionText = localQuestionLang === 'en' 
                  ? currentQ.optionsEn[optIdx] 
                  : currentQ.optionsHi[optIdx];

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-200 ring-1 ring-amber-500 shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {optLabel}
                    </span>
                    <span className="text-sm font-medium pt-0.5 leading-snug font-hindi">
                      {optionText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions for current question */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              
              <div className="flex items-center gap-2">
                {/* Clear Response */}
                <button
                  type="button"
                  onClick={handleClearResponse}
                  disabled={userAnswers[currentQ.id] === undefined}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Response</span>
                </button>

                {/* Mark for Review & Next */}
                <button
                  type="button"
                  onClick={handleMarkForReviewAndNext}
                  className="px-3 py-2 bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 text-xs font-medium rounded-lg border border-purple-700/60 flex items-center gap-1.5 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5 text-purple-400" />
                  <span>Mark for Review & Next</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Save & Next */}
                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                >
                  <span>Save & Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Right Column: Question Palette & Section Navigation */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 text-slate-100 shadow-sm space-y-4 sticky top-36">
            
            {/* Status Legend (Official Exam Code) */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                Question Palette Legend
              </h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-emerald-600 text-white flex items-center justify-center font-bold text-[9px]">
                    {answeredCount}
                  </span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-rose-600 text-white flex items-center justify-center font-bold text-[9px]">
                    {notAnsweredCount}
                  </span>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-[9px]">
                    {markedCount}
                  </span>
                  <span>Marked for Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-[9px] relative">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5" />
                    {answeredMarkedCount}
                  </span>
                  <span>Ans. & Marked</span>
                </div>
              </div>
            </div>

            {/* Questions Numbers Grid */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Select Question:</span>
                <span>{questions.length} Total</span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-72 overflow-y-auto p-1 pr-1.5">
                {questions.map((q, idx) => {
                  const status = questionStatuses[q.id] || 'unvisited';
                  const isCurrent = idx === currentIndex;
                  const isAnswered = userAnswers[q.id] !== undefined;

                  let bgClass = 'bg-slate-800 text-slate-400 border-slate-700'; // unvisited
                  if (status === 'answered') {
                    bgClass = 'bg-emerald-600 text-white border-emerald-500 font-bold';
                  } else if (status === 'not_answered') {
                    bgClass = 'bg-rose-600 text-white border-rose-500 font-bold';
                  } else if (status === 'marked') {
                    bgClass = 'bg-purple-600 text-white border-purple-500 font-bold';
                  } else if (status === 'answered_marked') {
                    bgClass = 'bg-purple-600 text-white border-purple-500 font-bold ring-2 ring-emerald-400';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all relative ${bgClass} ${
                        isCurrent ? 'ring-2 ring-amber-400 scale-105 z-10' : 'hover:opacity-90'
                      }`}
                    >
                      {idx + 1}
                      {status === 'answered_marked' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-0.5 right-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Summary Box */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                Answered: <strong className="text-emerald-400">{answeredCount + answeredMarkedCount}</strong>
              </div>
              <div>
                Remaining: <strong className="text-amber-400">{questions.length - (answeredCount + answeredMarkedCount)}</strong>
              </div>
            </div>

            {/* Submit test trigger */}
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Final Submit Test</span>
            </button>

          </div>

        </div>

      </div>

      {/* Confirmation Modal Before Submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-slate-100 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>Submit Confirmation</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-hindi">
              क्या आप परीक्षा समाप्त करके अपना परिणाम देखना चाहते हैं? सबमिट करने के उपरांत आप उत्तरों में संशोधन नहीं कर सकेंगे।
            </p>

            {/* Summary Grid in Modal */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/80 p-3 rounded-lg border border-slate-700">
              <div>
                <span className="text-slate-400">कुल प्रश्न:</span>
                <div className="font-bold text-white text-base">{questions.length}</div>
              </div>
              <div>
                <span className="text-slate-400">हल किए गए (Answered):</span>
                <div className="font-bold text-emerald-400 text-base">{answeredCount + answeredMarkedCount}</div>
              </div>
              <div>
                <span className="text-slate-400">अनुत्तरित (Unanswered):</span>
                <div className="font-bold text-rose-400 text-base">{questions.length - (answeredCount + answeredMarkedCount)}</div>
              </div>
              <div>
                <span className="text-slate-400">रिव्यू हेतु चिह्नित:</span>
                <div className="font-bold text-purple-400 text-base">{markedCount + answeredMarkedCount}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                Resume Test (वापस जाएं)
              </button>
              <button
                type="button"
                onClick={processAndSubmit}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                Yes, Submit Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
