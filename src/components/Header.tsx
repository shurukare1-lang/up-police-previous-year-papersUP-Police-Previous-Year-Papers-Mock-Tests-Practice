import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Shield, 
  BookOpen, 
  Clock, 
  BarChart3, 
  Bookmark, 
  AlertCircle, 
  Languages, 
  Award,
  Layers
} from 'lucide-react';
import { ExamCategory, AppView } from '../types';

export const Header: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    selectedCategory, 
    setSelectedCategory,
    language,
    setLanguage,
    wrongQuestionIds,
    bookmarks
  } = useApp();

  const handleCategoryChange = (cat: ExamCategory) => {
    setSelectedCategory(cat);
    if (currentView !== 'dashboard' && currentView !== 'practice' && currentView !== 'analytics') {
      setCurrentView('dashboard');
    }
  };

  const navItems: Array<{ id: AppView; labelEn: string; labelHi: string; icon: React.ReactNode; badgeCount?: number }> = [
    { id: 'dashboard', labelEn: '10-Year Dashboard', labelHi: '10-वर्षीय डैशबोर्ड', icon: <Layers className="w-4 h-4" /> },
    { id: 'practice', labelEn: 'PYQ Practice Modes', labelHi: 'अभ्यास मोड (8 Modes)', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'mistake_notebook', labelEn: 'Wrong Questions', labelHi: 'गलत प्रश्न बैंक', icon: <AlertCircle className="w-4 h-4" />, badgeCount: wrongQuestionIds.length },
    { id: 'bookmarks', labelEn: 'Saved Questions', labelHi: 'चिह्नित प्रश्न', icon: <Bookmark className="w-4 h-4" />, badgeCount: bookmarks.length },
    { id: 'analytics', labelEn: 'Performance & Tracking', labelHi: 'प्रगति एवं विश्लेषण', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40">
      {/* Top Bar with official branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                  UP POLICE PREVIOUS YEAR PAPERS & MOCK TESTS
                </span>
                <span className="hidden sm:inline-block text-xs text-amber-400 font-semibold border border-amber-500/40 rounded px-1.5 py-0.2">
                  10 YEARS ARCHIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-hindi">
                उत्तर प्रदेश पुलिस भर्ती एवं प्रोन्नति बोर्ड (UPPBPB) - 100% प्रामाणिक प्रश्नोत्तरी व परीक्षा पैटर्न
              </p>
            </div>
          </div>

          {/* Controls: Category Selector & Language Switcher */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Exam Category Segmented Control */}
            <div className="flex items-center p-1 bg-slate-800/90 rounded-lg border border-slate-700/80 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => handleCategoryChange('constable')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  selectedCategory === 'constable'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Constable (आरक्षी)
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('upsi')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  selectedCategory === 'upsi'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                SI / UPSI (दरोगा)
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('pet')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  selectedCategory === 'pet'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                UPSSSC PET
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('upcat')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  selectedCategory === 'upcat'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                UP CAT
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('ctet')}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  selectedCategory === 'ctet'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                CTET (CBSE)
              </button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-lg border border-slate-700/80 text-xs">
              <Languages className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'hi' ? 'bg-slate-700 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="केवल हिंदी"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-slate-700 text-amber-300 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Only English"
              >
                ENG
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bilingual')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'bilingual' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="द्विभाषी / Bilingual (Hindi + English)"
              >
                Bilingual
              </button>
            </div>
          </div>
        </div>

        {/* Primary Navigation Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 mt-3 pt-2.5 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-amber-400 font-semibold border-b-2 border-amber-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{language === 'en' ? item.labelEn : item.labelHi}</span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
