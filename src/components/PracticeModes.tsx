import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PAPERS_DATA, getAllQuestions, SUBJECT_METADATA } from '../data/papersData';
import { Question, SubjectType, PaperMeta } from '../types';
import { 
  BookOpen, 
  Layers, 
  Filter, 
  Shuffle, 
  Flame, 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Bookmark, 
  Play, 
  Sparkles,
  HelpCircle,
  Clock
} from 'lucide-react';

export const PracticeModes: React.FC = () => {
  const { 
    selectedCategory, 
    practiceFilter, 
    setPracticeFilter,
    selectedSubject, 
    setSelectedSubject,
    selectedTopic, 
    setSelectedTopic,
    selectedYear, 
    setSelectedYear,
    activePaper,
    startCustomTest,
    startMockTest,
    language,
    bookmarks,
    toggleBookmarkItem,
    wrongQuestionIds,
    analytics,
    setCurrentView
  } = useApp();

  const allQuestions = useMemo(() => getAllQuestions(), []);
  
  // Category filtered questions
  const categoryQuestions = useMemo(() => {
    const paperIds = PAPERS_DATA
      .filter(p => p.category === selectedCategory)
      .map(p => p.id);
    return allQuestions.filter(q => paperIds.includes(q.paperId));
  }, [allQuestions, selectedCategory]);

  // Extract unique topics for filter
  const availableTopics = useMemo(() => {
    const topicSet = new Set<string>();
    categoryQuestions.forEach(q => topicSet.add(q.topic));
    return Array.from(topicSet);
  }, [categoryQuestions]);

  // Active question index in practice flow
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [selectedPracticeAnswers, setSelectedPracticeAnswers] = useState<Record<string, number>>({});
  const [showExplanationMap, setShowExplanationMap] = useState<Record<string, boolean>>({});

  // Filter questions based on current practiceFilter
  const filteredQuestions = useMemo(() => {
    switch (practiceFilter) {
      case 'subject':
        if (selectedSubject === 'all') return categoryQuestions;
        return categoryQuestions.filter(q => q.subject === selectedSubject);
      
      case 'topic':
        if (selectedTopic === 'all') return categoryQuestions;
        return categoryQuestions.filter(q => q.topic === selectedTopic);

      case 'year':
        if (selectedYear === 'all') return categoryQuestions;
        const yearPaperIds = PAPERS_DATA
          .filter(p => p.category === selectedCategory && p.year === selectedYear)
          .map(p => p.id);
        return categoryQuestions.filter(q => yearPaperIds.includes(q.paperId));

      case 'mixed':
        // Mixed 10-year test: select a balanced set across multiple years
        return [...categoryQuestions].sort(() => 0.5 - Math.random()).slice(0, 30);

      case 'random':
        return [...categoryQuestions].sort(() => 0.5 - Math.random()).slice(0, 15);

      case 'weak_topic':
        // Questions from topics with low accuracy or wrong questions
        if (analytics.weakTopics.length > 0) {
          const weakTopicNames = analytics.weakTopics.map(w => w.topic);
          const found = categoryQuestions.filter(q => weakTopicNames.includes(q.topic));
          if (found.length > 0) return found;
        }
        // Fallback to wrong questions or general
        const wrongs = categoryQuestions.filter(q => wrongQuestionIds.includes(q.id));
        return wrongs.length > 0 ? wrongs : categoryQuestions.slice(0, 10);

      case 'all':
      default:
        if (activePaper) {
          return activePaper.questions;
        }
        return categoryQuestions;
    }
  }, [practiceFilter, selectedSubject, selectedTopic, selectedYear, activePaper, categoryQuestions, analytics.weakTopics, wrongQuestionIds]);

  const currentQ: Question | undefined = filteredQuestions[practiceIndex] || filteredQuestions[0];

  const handleSelectPracticeOption = (qId: string, optIdx: number) => {
    setSelectedPracticeAnswers(prev => ({ ...prev, [qId]: optIdx }));
    // Auto-reveal explanation on answer in practice mode
    setShowExplanationMap(prev => ({ ...prev, [qId]: true }));
  };

  const toggleSolution = (qId: string) => {
    setShowExplanationMap(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Launch mock test from current filtered selection
  const handleLaunchFilterMockTest = () => {
    const examLabel = 
      selectedCategory === 'constable' ? 'UP Police Constable' :
      selectedCategory === 'upsi' ? 'UP Police SI' :
      selectedCategory === 'pet' ? 'UPSSSC PET' :
      selectedCategory === 'upcat' ? 'UP CAT' : 'CTET (CBSE)';
    const examLabelHi = 
      selectedCategory === 'constable' ? 'उत्तर प्रदेश पुलिस आरक्षी' :
      selectedCategory === 'upsi' ? 'उत्तर प्रदेश पुलिस उपनिरीक्षक' :
      selectedCategory === 'pet' ? 'यूपीएसएसएससी PET' :
      selectedCategory === 'upcat' ? 'यूपी कैट (UP CAT)' : 'केन्द्रीय शिक्षक पात्रता परीक्षा (CTET)';

    const title = `${examLabel} - Practice Mock (${filteredQuestions.length} Qs)`;
    const titleHi = `${examLabelHi} अभ्यास टेस्ट (${filteredQuestions.length} प्रश्न)`;
    const duration = Math.max(15, Math.round(filteredQuestions.length * (selectedCategory === 'ctet' ? 1.0 : 0.8)));
    const marking = 
      selectedCategory === 'constable' ? { positive: 2.0, negative: 0.5 } :
      selectedCategory === 'upsi' ? { positive: 2.5, negative: 0.0 } :
      selectedCategory === 'pet' ? { positive: 1.0, negative: 0.25 } :
      selectedCategory === 'upcat' ? { positive: 3.0, negative: 1.0 } :
      { positive: 1.0, negative: 0.0 };

    startCustomTest(title, titleHi, filteredQuestions, duration, marking);
  };

  const practiceModesList: Array<{ id: typeof practiceFilter; labelHi: string; labelEn: string; icon: React.ReactNode }> = [
    { id: 'all', labelHi: '1. सम्पूर्ण प्रश्न पत्र (Full Paper)', labelEn: '1. Full Paper', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'subject', labelHi: '2. विषयवार PYQ (Subject-wise)', labelEn: '2. Subject-wise', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'topic', labelHi: '3. टॉपिक-वार PYQ (Topic-wise)', labelEn: '3. Topic-wise', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'year', labelHi: '4. वर्षवार PYQ (Year-wise)', labelEn: '4. Year-wise', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'random', labelHi: '5. यादृच्छिक PYQ (Random 15)', labelEn: '5. Random Quiz', icon: <Shuffle className="w-3.5 h-3.5" /> },
    { id: 'mixed', labelHi: '6. मिश्रित 10-वर्षीय टेस्ट', labelEn: '6. Mixed 10-Year Test', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'weak_topic', labelHi: '7. कमजोर टॉपिक अभ्यास', labelEn: '7. Weak Topics', icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-amber-400">PRACTICE MODES (8 SPECIALIZED FORMATS)</span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {selectedCategory === 'constable' ? 'UP Police Constable PYQ Practice' : 'UP Police SI / UPSI PYQ Practice'}
            </h1>
            <p className="text-xs text-slate-400 font-hindi mt-0.5">
              अपनी तैयारी को मजबूत करने के लिए विषयवार, टॉपिक-वार, वर्षवार अथवा कमजोर टॉपिक अनुसार अभ्यास करें।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentView('mistake_notebook')}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>8. Wrong Questions ({wrongQuestionIds.length})</span>
            </button>

            {filteredQuestions.length > 0 && (
              <button
                type="button"
                onClick={handleLaunchFilterMockTest}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Timed Mock ({filteredQuestions.length} Qs)</span>
              </button>
            )}
          </div>
        </div>

        {/* 8 Modes Horizontal Navigation Tabs (Segmented Control Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-4 pt-3 border-t border-slate-800 no-scrollbar text-xs">
          {practiceModesList.map((m) => {
            const isActive = practiceFilter === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setPracticeFilter(m.id);
                  setPracticeIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                {m.icon}
                <span>{language === 'en' ? m.labelEn : m.labelHi}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Filters depending on mode */}
        {practiceFilter === 'subject' && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium">Select Subject:</span>
            <button
              type="button"
              onClick={() => { setSelectedSubject('all'); setPracticeIndex(0); }}
              className={`px-2.5 py-1 rounded transition-colors ${selectedSubject === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
            >
              All Subjects
            </button>
            {Object.entries(SUBJECT_METADATA)
              .filter(([k]) => {
                if (selectedCategory === 'ctet') {
                  return ['cdp', 'maths', 'evs', 'hindi', 'english', 'science', 'social_studies'].includes(k);
                }
                if (selectedCategory === 'upsi') {
                  return ['gk', 'hindi', 'maths', 'reasoning', 'mool_vidhi'].includes(k);
                }
                return ['gk', 'hindi', 'maths', 'reasoning'].includes(k);
              })
              .map(([k, meta]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => { setSelectedSubject(k as SubjectType); setPracticeIndex(0); }}
                  className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${selectedSubject === k ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
                >
                  {language === 'en' ? meta.nameEn : meta.nameHi}
                </button>
              ))}
          </div>
        )}

        {practiceFilter === 'topic' && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium">Select Topic:</span>
            <select
              value={selectedTopic}
              onChange={(e) => { setSelectedTopic(e.target.value); setPracticeIndex(0); }}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs outline-none focus:border-amber-500"
            >
              <option value="all">All Available Topics ({availableTopics.length})</option>
              {availableTopics.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        {practiceFilter === 'year' && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium">Select Year:</span>
            <button
              type="button"
              onClick={() => { setSelectedYear('all'); setPracticeIndex(0); }}
              className={`px-2.5 py-1 rounded transition-colors ${selectedYear === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
            >
              All Years
            </button>
            {(selectedCategory === 'constable' ? [2024, 2020, 2019, 2018, 2013] : [2021, 2017, 2014, 2011]).map(yr => (
              <button
                key={yr}
                type="button"
                onClick={() => { setSelectedYear(yr); setPracticeIndex(0); }}
                className={`px-2.5 py-1 rounded transition-colors ${selectedYear === yr ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
              >
                {yr}
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Main Practice Interactive Card */}
      {currentQ ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 text-slate-100 shadow-sm space-y-4">
          
          {/* Practice Question Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                Practice Q. {practiceIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="font-medium text-slate-300">
                {language === 'en' ? currentQ.subjectNameEn : currentQ.subjectNameHi}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400">
                {language === 'en' ? currentQ.topic : currentQ.topicHi}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-400">{currentQ.difficulty}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleBookmarkItem(currentQ.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                  bookmarks.includes(currentQ.id)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(currentQ.id) ? 'fill-current' : ''}`} />
                <span>{bookmarks.includes(currentQ.id) ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-medium text-slate-100 my-2 leading-relaxed font-hindi">
            {language === 'en' ? currentQ.textEn : currentQ.textHi}
          </div>

          {/* Practice Options */}
          <div className="space-y-2.5 pt-1">
            {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => {
              const selectedOpt = selectedPracticeAnswers[currentQ.id];
              const isSelected = selectedOpt === optIdx;
              const hasAnswered = selectedOpt !== undefined;
              const isCorrectOpt = currentQ.correctOption === optIdx;
              const optText = language === 'en' ? currentQ.optionsEn[optIdx] : currentQ.optionsHi[optIdx];

              let cardClass = 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800';

              if (hasAnswered) {
                if (isCorrectOpt) {
                  cardClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectOpt) {
                  cardClass = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectPracticeOption(currentQ.id, optIdx)}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm font-medium flex items-start gap-3 transition-all ${cardClass}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    hasAnswered && isCorrectOpt
                      ? 'bg-emerald-500 text-slate-950'
                      : hasAnswered && isSelected && !isCorrectOpt
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {optLabel}
                  </span>

                  <div className="flex-1 pt-0.5 font-hindi">
                    {optText}
                    {hasAnswered && isCorrectOpt && (
                      <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                        ✓ Correct Answer (सही उत्तर)
                      </span>
                    )}
                    {hasAnswered && isSelected && !isCorrectOpt && (
                      <span className="text-[11px] text-rose-400 font-bold block mt-0.5">
                        ✕ Incorrect (गलत उत्तर)
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation Button & View */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => toggleSolution(currentQ.id)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showExplanationMap[currentQ.id] ? 'Hide Explanation' : 'Reveal Solution & Explanation'}</span>
            </button>

            {showExplanationMap[currentQ.id] && (
              <div className="mt-2.5 p-3.5 bg-slate-800/70 border border-slate-700 rounded-lg text-xs text-slate-200 space-y-1.5 font-hindi leading-relaxed">
                <div>
                  <strong className="text-amber-400">विस्तृत स्पष्टीकरण: </strong>
                  <span>{currentQ.explanationHi}</span>
                </div>
                {language === 'bilingual' && (
                  <div className="pt-1 text-slate-400 text-[11px] font-sans">
                    <strong className="text-slate-300">English Solution: </strong>
                    <span>{currentQ.explanationEn}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Prev / Next */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              disabled={practiceIndex === 0}
              onClick={() => setPracticeIndex(practiceIndex - 1)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <span className="text-xs text-slate-400">
              {practiceIndex + 1} / {filteredQuestions.length}
            </span>

            <button
              type="button"
              disabled={practiceIndex >= filteredQuestions.length - 1}
              onClick={() => setPracticeIndex(practiceIndex + 1)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
          <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No questions found matching the selected filter.</p>
          <p className="text-xs text-slate-400 mt-1">Please change the filter or select All to continue practice.</p>
        </div>
      )}

    </div>
  );
};
