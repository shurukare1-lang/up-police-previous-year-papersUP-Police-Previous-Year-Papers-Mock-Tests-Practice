import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAllQuestions } from '../data/papersData';
import { 
  Bookmark, 
  Trash2, 
  Play, 
  Eye, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const { 
    bookmarks, 
    toggleBookmarkItem, 
    startCustomTest, 
    setCurrentView,
    language,
    selectedCategory 
  } = useApp();

  const allQuestions = getAllQuestions();
  const savedQuestions = allQuestions.filter(q => bookmarks.includes(q.id));
  const [showSolutionMap, setShowSolutionMap] = useState<Record<string, boolean>>({});

  const handleLaunchSavedQuiz = () => {
    if (savedQuestions.length === 0) return;
    const title = `Bookmarked Questions Mock (${savedQuestions.length} Qs)`;
    const titleHi = `चिह्नित प्रश्न विशेष टेस्ट (${savedQuestions.length} प्रश्न)`;
    const duration = Math.max(10, Math.round(savedQuestions.length * 0.9));
    const marking = selectedCategory === 'constable'
      ? { positive: 2.0, negative: 0.5 }
      : { positive: 2.5, negative: 0.0 };

    startCustomTest(title, titleHi, savedQuestions, duration, marking);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 fill-current" />
              <span>SAVED & BOOKMARKED QUESTIONS (महत्वपूर्ण प्रश्न)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Revision Bookmarks ({savedQuestions.length})
            </h1>
            <p className="text-xs text-slate-400 font-hindi mt-0.5">
              कठिन और महत्वपूर्ण प्रश्नों का व्यक्तिगत संग्रह, ताकि आप परीक्षा पूर्व त्वरित पुनरावलोकन कर सकें।
            </p>
          </div>

          {savedQuestions.length > 0 && (
            <button
              type="button"
              onClick={handleLaunchSavedQuiz}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Take Test ({savedQuestions.length} Qs)</span>
            </button>
          )}
        </div>
      </div>

      {savedQuestions.length > 0 ? (
        <div className="space-y-4">
          {savedQuestions.map((q, idx) => (
            <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                    Bookmark #{idx + 1}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {language === 'en' ? q.subjectNameEn : q.subjectNameHi}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-400">{language === 'en' ? q.topic : q.topicHi}</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleBookmarkItem(q.id)}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div className="text-sm sm:text-base font-medium text-slate-100 font-hindi leading-relaxed">
                {language === 'en' ? q.textEn : q.textHi}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => (
                  <div
                    key={optIdx}
                    className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                      q.correctOption === optIdx
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      q.correctOption === optIdx ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {optLabel}
                    </span>
                    <span className="font-hindi">{language === 'en' ? q.optionsEn[optIdx] : q.optionsHi[optIdx]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowSolutionMap(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <span>{showSolutionMap[q.id] ? 'Hide Solution' : 'View Detailed Solution'}</span>
                </button>

                {showSolutionMap[q.id] && (
                  <div className="mt-2 p-3 bg-slate-800/70 border border-slate-700 rounded-lg text-xs text-slate-200 font-hindi leading-relaxed">
                    <strong className="text-amber-400">विस्तृत हल: </strong>
                    <span>{q.explanationHi}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 space-y-3">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-base font-bold text-white">No Bookmarked Questions Yet</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-hindi">
            जब आप 10-वर्षीय प्रश्न पत्रों का अध्ययन या मॉक टेस्ट का विश्लेषण कर रहे हों, तो किसी भी प्रश्न पर "Bookmark" बटन दबाकर उसे यहाँ जोड़ सकते हैं।
          </p>
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
          >
            Explore 10-Year Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
