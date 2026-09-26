import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Award, 
  Play, 
  BookOpen, 
  Eye, 
  EyeOff, 
  Printer, 
  Layers,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export const PaperViewer: React.FC = () => {
  const { 
    activePaper, 
    setCurrentView, 
    startMockTest, 
    openPracticeMode, 
    language,
    bookmarks,
    toggleBookmarkItem 
  } = useApp();

  const [showAnswerKeys, setShowAnswerKeys] = useState<boolean>(true);

  if (!activePaper) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
        <p className="text-base font-bold text-white mb-2">No paper selected.</p>
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

  return (
    <div className="space-y-6">
      
      {/* Official Master Paper Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-100 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>OFFICIAL MASTER QUESTION PAPER ARCHIVE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {language === 'en' ? activePaper.examName : activePaper.examNameHi}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-hindi">
              {activePaper.postNameHi} · {activePaper.examDate} · {activePaper.shift}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowAnswerKeys(!showAnswerKeys)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {showAnswerKeys ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
              <span>{showAnswerKeys ? 'Hide Answer Key' : 'Show Answer Key'}</span>
            </button>

            <button
              type="button"
              onClick={() => startMockTest(activePaper)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Attempt Timed Mock</span>
            </button>

            <button
              type="button"
              onClick={() => openPracticeMode({ paper: activePaper })}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Practice Mode</span>
            </button>
          </div>
        </div>

        {/* Verification and Legal Source Disclosure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/80">
          <div>
            <span className="text-slate-400 block">Verified Source:</span>
            <strong className="text-slate-200">{activePaper.verifiedSource}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Paper / Booklet Code:</span>
            <strong className="text-amber-400 font-mono">{activePaper.paperCode}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Last Verified Date:</span>
            <strong className="text-emerald-400">{activePaper.lastVerifiedDate}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Exam Marking Pattern:</span>
            <strong className="text-slate-200">
              +{activePaper.markingScheme.positive} / -{activePaper.markingScheme.negative} Marks
            </strong>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-hindi">
          <strong>टिप्पणी: </strong> {activePaper.verificationNotes}
        </p>

      </div>

      {/* Paper Questions Listing */}
      <div className="space-y-4">
        {activePaper.questions.map((q, idx) => (
          <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Q. {q.questionNumber || idx + 1}
                </span>
                <span className="text-slate-300 font-medium">
                  {language === 'en' ? q.subjectNameEn : q.subjectNameHi}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-400">
                  {language === 'en' ? q.topic : q.topicHi}
                </span>
              </div>

              <button
                type="button"
                onClick={() => toggleBookmarkItem(q.id)}
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded border transition-colors ${
                  bookmarks.includes(q.id)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(q.id) ? 'fill-current' : ''}`} />
                <span>{bookmarks.includes(q.id) ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <div className="text-sm sm:text-base font-medium text-slate-100 font-hindi leading-relaxed">
              {language === 'en' ? q.textEn : q.textHi}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => {
                const isCorrect = q.correctOption === optIdx;
                const optText = language === 'en' ? q.optionsEn[optIdx] : q.optionsHi[optIdx];

                return (
                  <div
                    key={optIdx}
                    className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                      showAnswerKeys && isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      showAnswerKeys && isCorrect
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {optLabel}
                    </span>
                    <span className="font-hindi">{optText}</span>
                  </div>
                );
              })}
            </div>

            {/* Answer and Explanation */}
            {showAnswerKeys && (
              <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs text-slate-300 space-y-1 bg-slate-800/40 p-3 rounded-lg">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>सही उत्तर: विकल्प {['A', 'B', 'C', 'D'][q.correctOption]} ({q.optionsHi[q.correctOption]})</span>
                </div>
                <div className="font-hindi text-slate-300 pt-1">
                  <strong className="text-amber-400">विस्तृत हल: </strong>
                  <span>{q.explanationHi}</span>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
