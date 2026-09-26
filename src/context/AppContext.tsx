import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppView, 
  ExamCategory, 
  PaperMeta, 
  Question, 
  SubjectType, 
  TestAttempt,
  PracticeFilterType
} from '../types';
import { PAPERS_DATA, getAllQuestions } from '../data/papersData';
import { 
  getStoredAttempts, 
  saveAttempt, 
  getStoredBookmarks, 
  toggleBookmark as storageToggleBookmark,
  getStoredWrongQuestionIds,
  removeWrongQuestion as storageRemoveWrongQuestion,
  getLanguagePreference,
  setLanguagePreference as storageSetLanguage,
  computeAnalytics,
  ComprehensiveAnalytics
} from '../utils/storage';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCategory: ExamCategory;
  setSelectedCategory: (cat: ExamCategory) => void;
  language: 'hi' | 'en' | 'bilingual';
  setLanguage: (lang: 'hi' | 'en' | 'bilingual') => void;
  
  // Active test / view state
  activePaper: PaperMeta | null;
  activeTestQuestions: Question[];
  activeTestTitle: string;
  activeTestTitleHi: string;
  activeTestDurationMinutes: number;
  activeMarking: {
    positive: number;
    negative: number;
    sectionalCutoffPercent?: number;
    overallCutoffPercent?: number;
  };
  latestAttempt: TestAttempt | null;
  
  // Practice states
  practiceFilter: PracticeFilterType;
  setPracticeFilter: (f: PracticeFilterType) => void;
  selectedSubject: SubjectType | 'all';
  setSelectedSubject: (s: SubjectType | 'all') => void;
  selectedTopic: string | 'all';
  setSelectedTopic: (t: string | 'all') => void;
  selectedYear: number | 'all';
  setSelectedYear: (y: number | 'all') => void;
  
  // Bookmarks & Mistakes
  bookmarks: string[];
  toggleBookmarkItem: (qId: string) => void;
  wrongQuestionIds: string[];
  removeWrongItem: (qId: string) => void;

  // Actions
  startMockTest: (paper: PaperMeta) => void;
  startCustomTest: (
    title: string, 
    titleHi: string, 
    questions: Question[], 
    durationMinutes: number, 
    marking: { positive: number; negative: number; sectionalCutoffPercent?: number }
  ) => void;
  openPaperViewer: (paper: PaperMeta) => void;
  openPracticeMode: (params?: { paper?: PaperMeta; subject?: SubjectType; topic?: string; year?: number }) => void;
  finishTest: (attempt: TestAttempt) => void;
  viewAttemptResult: (attempt: TestAttempt) => void;
  
  // Stats
  analytics: ComprehensiveAnalytics;
  refreshAnalytics: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>('constable');
  const [language, setLanguageState] = useState<'hi' | 'en' | 'bilingual'>('bilingual');
  
  const [activePaper, setActivePaper] = useState<PaperMeta | null>(null);
  const [activeTestQuestions, setActiveTestQuestions] = useState<Question[]>([]);
  const [activeTestTitle, setActiveTestTitle] = useState<string>('');
  const [activeTestTitleHi, setActiveTestTitleHi] = useState<string>('');
  const [activeTestDurationMinutes, setActiveTestDurationMinutes] = useState<number>(120);
  const [activeMarking, setActiveMarking] = useState<{ positive: number; negative: number; sectionalCutoffPercent?: number }>({
    positive: 2.0,
    negative: 0.5
  });
  
  const [latestAttempt, setLatestAttempt] = useState<TestAttempt | null>(null);
  
  // Practice filters
  const [practiceFilter, setPracticeFilter] = useState<PracticeFilterType>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Bookmarks & mistakes
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<ComprehensiveAnalytics>(computeAnalytics());

  useEffect(() => {
    setLanguageState(getLanguagePreference());
    setBookmarks(getStoredBookmarks());
    setWrongQuestionIds(getStoredWrongQuestionIds());
    setAnalytics(computeAnalytics());
  }, []);

  const setLanguage = (lang: 'hi' | 'en' | 'bilingual') => {
    setLanguageState(lang);
    storageSetLanguage(lang);
  };

  const refreshAnalytics = () => {
    setAnalytics(computeAnalytics());
    setBookmarks(getStoredBookmarks());
    setWrongQuestionIds(getStoredWrongQuestionIds());
  };

  const toggleBookmarkItem = (qId: string) => {
    storageToggleBookmark(qId);
    setBookmarks(getStoredBookmarks());
  };

  const removeWrongItem = (qId: string) => {
    storageRemoveWrongQuestion(qId);
    setWrongQuestionIds(getStoredWrongQuestionIds());
  };

  const startMockTest = (paper: PaperMeta) => {
    setActivePaper(paper);
    setActiveTestQuestions(paper.questions);
    setActiveTestTitle(paper.examName);
    setActiveTestTitleHi(paper.examNameHi);
    setActiveTestDurationMinutes(paper.durationMinutes);
    setActiveMarking(paper.markingScheme);
    setCurrentView('mock_test');
  };

  const startCustomTest = (
    title: string, 
    titleHi: string, 
    questions: Question[], 
    durationMinutes: number, 
    marking: { positive: number; negative: number; sectionalCutoffPercent?: number }
  ) => {
    setActivePaper(null);
    setActiveTestQuestions(questions);
    setActiveTestTitle(title);
    setActiveTestTitleHi(titleHi);
    setActiveTestDurationMinutes(durationMinutes);
    setActiveMarking(marking);
    setCurrentView('mock_test');
  };

  const openPaperViewer = (paper: PaperMeta) => {
    setActivePaper(paper);
    setCurrentView('view_paper');
  };

  const openPracticeMode = (params?: { paper?: PaperMeta; subject?: SubjectType; topic?: string; year?: number }) => {
    if (params?.paper) {
      setActivePaper(params.paper);
    }
    if (params?.subject) {
      setSelectedSubject(params.subject);
      setPracticeFilter('subject');
    }
    if (params?.topic) {
      setSelectedTopic(params.topic);
      setPracticeFilter('topic');
    }
    if (params?.year) {
      setSelectedYear(params.year);
      setPracticeFilter('year');
    }
    setCurrentView('practice');
  };

  const finishTest = (attempt: TestAttempt) => {
    saveAttempt(attempt);
    setLatestAttempt(attempt);
    refreshAnalytics();
    setCurrentView('test_result');
  };

  const viewAttemptResult = (attempt: TestAttempt) => {
    setLatestAttempt(attempt);
    setCurrentView('test_result');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        language,
        setLanguage,
        activePaper,
        activeTestQuestions,
        activeTestTitle,
        activeTestTitleHi,
        activeTestDurationMinutes,
        activeMarking,
        latestAttempt,
        practiceFilter,
        setPracticeFilter,
        selectedSubject,
        setSelectedSubject,
        selectedTopic,
        setSelectedTopic,
        selectedYear,
        setSelectedYear,
        bookmarks,
        toggleBookmarkItem,
        wrongQuestionIds,
        removeWrongItem,
        startMockTest,
        startCustomTest,
        openPaperViewer,
        openPracticeMode,
        finishTest,
        viewAttemptResult,
        analytics,
        refreshAnalytics
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
