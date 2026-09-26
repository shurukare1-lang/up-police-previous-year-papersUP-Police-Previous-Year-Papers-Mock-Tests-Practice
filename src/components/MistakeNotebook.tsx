import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAllQuestions } from '../data/papersData';
import { Question } from '../types';
import { 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trash2, 
  Play, 
  Eye, 
  EyeOff, 
  Bookmark, 
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const MistakeNotebook: React.FC = () => {
  const { 
    wrongQuestionIds, 
    removeWrongItem, 
    startCustomTest, 
    setCurrentView,
    language,
    bookmarks,
    toggleBookmarkItem,
    selectedCategory 
  } = useApp();

  const allQuestions = getAllQuestions();
  const wrongQuestions = allQuestions.filter(q => wrongQuestionIds.includes(q.id));

  const [testModeAnswers, setTestModeAnswers] = useState<Record<string, number>>({});
  const [showSolutionMap, setShowSolutionMap] = useState<Record<string, boolean>>({});

  const handleSelectOption = (qId: string, optIdx: number) => {
    setTestModeAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setShowSolutionMap(prev => ({ ...prev, [qId]: true }));
  };

  const handleLaunchMistakeTest = () => {
    if (wrongQuestions.length === 0) return;
    const title = `Wrong Questions Remedial Mock (${wrongQuestions.length} Qs)`;
    const titleHi = `गलत प्रश्न सुधार मॉक टेस्ट (${wrongQuestions.length} प्रश्न)`;
    const duration = Math.max(10, Math.round(wrongQuestions.length * 0.9));
    const marking = selectedCategory === 'constable'
      ? { positive: 2.0, negative: 0.5 }
      : { positive: 2.5, negative: 0.0 };

    startCustomTest(title, titleHi, wrongQuestions, duration, marking);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-rose-400 mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>REMEDIAL MISTAKE NOTEBOOK (गलत प्रश्न डायरी)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Wrong Questions & Mistakes Bank
            </h1>
            <p className="text-xs text-slate-400 font-hindi mt-0.5">
              आपके द्वारा मॉक टेस्ट में गलत किए गए सभी प्रश्नों का स्वचालित संग्रह। बार-बार अभ्यास करें जब तक कि 100% शुद्धता प्राप्त न हो।
            </p>
          </div>

          {wrongQuestions.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLaunchMistakeTest}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test All {wrongQuestions.length} Mistakes</span>
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-4 text-xs text-slate-400">
          <div>
            Total Mistakes Tracked: <strong className="text-rose-400">{wrongQuestions.length}</strong>
          </div>
          <span>·</span>
          <div>
            Goal: <span className="text-emerald-400 font-semibold">Master all mistakes to 0</span>
          </div>
        </div>
      </div>

      {/* Questions list */}
      {wrongQuestions.length > 0 ? (
        <div className="space-y-4">
          {wrongQuestions.map((q, idx) => {
            const chosen = testModeAnswers[q.id];
            const hasAnswered = chosen !== undefined;
            const isCorrectNow = chosen === q.correctOption;
            const showSolution = showSolutionMap[q.id];

            return (
              <div 
                key={q.id}
                className={`bg-slate-900 border rounded-xl p-5 text-slate-100 shadow-sm space-y-3 transition-all ${
                  hasAnswered && isCorrectNow
                    ? 'border-emerald-800/80 bg-slate-900/95'
                    : 'border-slate-800'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded">
                      Mistake #{idx + 1}
                    </span>
                    <span className="text-slate-300 font-medium">
                      {language === 'en' ? q.subjectNameEn : q.subjectNameHi}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400 font-hindi">
                      {language === 'en' ? q.topic : q.topicHi}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mark as Mastered (Remove from mistake book) */}
                    <button
                      type="button"
                      onClick={() => removeWrongItem(q.id)}
                      className="px-2.5 py-1 text-emerald-400 hover:bg-emerald-950/40 rounded border border-emerald-600/40 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="Mark as Mastered and Remove"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Mastered</span>
                    </button>

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
                <div className="text-sm sm:text-base font-medium text-slate-100 font-hindi leading-relaxed">
                  {language === 'en' ? q.textEn : q.textHi}
                </div>

                {/* Options with interactive re-attempt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => {
                    const isSelected = chosen === optIdx;
                    const isOfficialCorrect = q.correctOption === optIdx;
                    const optText = language === 'en' ? q.optionsEn[optIdx] : q.optionsHi[optIdx];

                    let optClass = 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800';

                    if (hasAnswered) {
                      if (isOfficialCorrect) {
                        optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                      } else if (isSelected && !isOfficialCorrect) {
                        optClass = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-2.5 rounded-lg border text-xs text-left flex items-start gap-2.5 transition-all ${optClass}`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          hasAnswered && isOfficialCorrect
                            ? 'bg-emerald-500 text-slate-950'
                            : hasAnswered && isSelected && !isOfficialCorrect
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {optLabel}
                        </span>
                        <div className="flex-1 font-hindi">
                          {optText}
                          {hasAnswered && isOfficialCorrect && (
                            <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                              ✓ Correct Solution
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Solution Reveal */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSolutionMap(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    <span>{showSolution ? 'Hide Solution' : 'View Correct Answer & Explanation'}</span>
                  </button>

                  {showSolution && (
                    <div className="mt-2.5 p-3.5 bg-slate-800/70 border border-slate-700 rounded-lg text-xs text-slate-200 space-y-1.5 font-hindi leading-relaxed">
                      <div className="text-emerald-400 font-bold">
                        सही उत्तर: विकल्प {['A', 'B', 'C', 'D'][q.correctOption]} ({q.optionsHi[q.correctOption]})
                      </div>
                      <div>
                        <strong className="text-amber-400">विस्तृत स्पष्टीकरण: </strong>
                        <span>{q.explanationHi}</span>
                      </div>
                      {language === 'bilingual' && (
                        <div className="pt-1 text-slate-400 text-[11px] font-sans">
                          <strong className="text-slate-300">English: </strong>
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
      ) : (
        <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-base font-bold text-white">Your Mistake Notebook is Clean!</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-hindi">
            उत्कृष्ट! वर्तमान में कोई भी गलत प्रश्न लंबित नहीं है। जब आप मॉक टेस्ट देंगे और यदि कोई प्रश्न गलत होगा, तो वह स्वचालित रूप से यहाँ अभ्यास हेतु जुड़ जाएगा।
          </p>
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
          >
            Start a Mock Test
          </button>
        </div>
      )}

    </div>
  );
};
