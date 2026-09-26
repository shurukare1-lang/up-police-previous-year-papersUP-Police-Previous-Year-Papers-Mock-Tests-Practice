import { TestAttempt, Question } from '../types';
import { PAPERS_DATA, getAllQuestions } from '../data/papersData';

const ATTEMPTS_KEY = 'uppolice_pyq_test_attempts_v1';
const BOOKMARKS_KEY = 'uppolice_pyq_bookmarks_v1';
const WRONG_QS_KEY = 'uppolice_pyq_wrong_questions_v1';
const LANG_PREF_KEY = 'uppolice_pyq_language_pref';

export const getStoredAttempts = (): TestAttempt[] => {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse attempts from storage', e);
    return [];
  }
};

export const saveAttempt = (attempt: TestAttempt): void => {
  try {
    const attempts = getStoredAttempts();
    const updated = [attempt, ...attempts];
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated));

    // Also update wrong questions
    const allQuestions = getAllQuestions();
    const wrongIds = Object.entries(attempt.answers)
      .filter(([qId, selectedOption]) => {
        const q = allQuestions.find(item => item.id === qId);
        return q && selectedOption !== q.correctOption;
      })
      .map(([qId]) => qId);

    if (wrongIds.length > 0) {
      addWrongQuestions(wrongIds);
    }
  } catch (e) {
    console.error('Failed to save attempt', e);
  }
};

export const getStoredBookmarks = (): string[] => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const toggleBookmark = (questionId: string): boolean => {
  try {
    const bookmarks = getStoredBookmarks();
    const exists = bookmarks.includes(questionId);
    const updated = exists 
      ? bookmarks.filter(id => id !== questionId)
      : [...bookmarks, questionId];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return !exists;
  } catch (e) {
    return false;
  }
};

export const isBookmarked = (questionId: string): boolean => {
  const bookmarks = getStoredBookmarks();
  return bookmarks.includes(questionId);
};

export const getStoredWrongQuestionIds = (): string[] => {
  try {
    const raw = localStorage.getItem(WRONG_QS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const addWrongQuestions = (questionIds: string[]): void => {
  try {
    const current = getStoredWrongQuestionIds();
    const merged = Array.from(new Set([...current, ...questionIds]));
    localStorage.setItem(WRONG_QS_KEY, JSON.stringify(merged));
  } catch (e) {
    console.error('Failed to update wrong questions', e);
  }
};

export const removeWrongQuestion = (questionId: string): void => {
  try {
    const current = getStoredWrongQuestionIds();
    const updated = current.filter(id => id !== questionId);
    localStorage.setItem(WRONG_QS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove wrong question', e);
  }
};

export const getLanguagePreference = (): 'hi' | 'en' | 'bilingual' => {
  return (localStorage.getItem(LANG_PREF_KEY) as 'hi' | 'en' | 'bilingual') || 'bilingual';
};

export const setLanguagePreference = (lang: 'hi' | 'en' | 'bilingual'): void => {
  localStorage.setItem(LANG_PREF_KEY, lang);
};

// Analytics helpers
export interface ComprehensiveAnalytics {
  totalAttempts: number;
  constableAttempts: number;
  upsiAttempts: number;
  petAttempts: number;
  upcatAttempts: number;
  ctetAttempts: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  averageScorePercent: number;
  avgTimePerQuestionSec: number;
  subjectAnalytics: Record<string, {
    nameHi: string;
    nameEn: string;
    attempted: number;
    correct: number;
    accuracy: number;
  }>;
  weakTopics: Array<{ topic: string; topicHi: string; total: number; incorrect: number; failureRate: number }>;
  bestSubjects: Array<{ subjectKey: string; nameHi: string; accuracy: number }>;
  recentScores: Array<{ paperTitle: string; date: string; score: number; maxScore: number; accuracy: number }>;
}

export const computeAnalytics = (): ComprehensiveAnalytics => {
  const attempts = getStoredAttempts();
  const allQs = getAllQuestions();

  const totalAttempts = attempts.length;
  const constableAttempts = attempts.filter(a => a.category === 'constable').length;
  const upsiAttempts = attempts.filter(a => a.category === 'upsi').length;
  const petAttempts = attempts.filter(a => a.category === 'pet').length;
  const upcatAttempts = attempts.filter(a => a.category === 'upcat').length;
  const ctetAttempts = attempts.filter(a => a.category === 'ctet').length;

  let totalQuestionsAnswered = 0;
  let totalCorrect = 0;
  let totalScoreRatioSum = 0;
  let totalTimeSum = 0;

  const subjectMap: Record<string, { attempted: number; correct: number; nameHi: string; nameEn: string }> = {
    gk: { attempted: 0, correct: 0, nameHi: 'सामान्य ज्ञान', nameEn: 'General Knowledge' },
    hindi: { attempted: 0, correct: 0, nameHi: 'सामान्य हिन्दी', nameEn: 'General Hindi' },
    maths: { attempted: 0, correct: 0, nameHi: 'गणित व संख्यात्मक योग्यता', nameEn: 'Mathematics & Aptitude' },
    reasoning: { attempted: 0, correct: 0, nameHi: 'तार्किक क्षमता', nameEn: 'Mental Reasoning' },
    mool_vidhi: { attempted: 0, correct: 0, nameHi: 'मूलविधि एवं संविधान', nameEn: 'Law & Constitution' },
    cdp: { attempted: 0, correct: 0, nameHi: 'बाल विकास एवं शिक्षाशास्त्र', nameEn: 'Child Development & Pedagogy' },
    evs: { attempted: 0, correct: 0, nameHi: 'पर्यावरण अध्ययन', nameEn: 'Environmental Studies' },
    english: { attempted: 0, correct: 0, nameHi: 'अंग्रेजी भाषा व शिक्षण', nameEn: 'English Language & Pedagogy' },
    science: { attempted: 0, correct: 0, nameHi: 'विज्ञान एवं शिक्षणशास्त्र', nameEn: 'Science & Pedagogy' },
    social_studies: { attempted: 0, correct: 0, nameHi: 'सामाजिक अध्ययन व शिक्षण', nameEn: 'Social Studies & Pedagogy' }
  };

  const topicTally: Record<string, { topicHi: string; total: number; incorrect: number }> = {};

  attempts.forEach(att => {
    totalScoreRatioSum += att.maxScore > 0 ? (att.score / att.maxScore) : 0;
    totalTimeSum += att.timeTakenSeconds;

    Object.entries(att.answers).forEach(([qId, selectedOption]) => {
      const q = allQs.find(item => item.id === qId);
      if (!q) return;

      totalQuestionsAnswered++;
      const isCorrect = selectedOption === q.correctOption;
      if (isCorrect) totalCorrect++;

      if (subjectMap[q.subject]) {
        subjectMap[q.subject].attempted++;
        if (isCorrect) subjectMap[q.subject].correct++;
      }

      const tKey = q.topic;
      if (!topicTally[tKey]) {
        topicTally[tKey] = { topicHi: q.topicHi, total: 0, incorrect: 0 };
      }
      topicTally[tKey].total++;
      if (!isCorrect) {
        topicTally[tKey].incorrect++;
      }
    });
  });

  const overallAccuracy = totalQuestionsAnswered > 0 
    ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) 
    : 0;
  
  const averageScorePercent = totalAttempts > 0 
    ? Math.round((totalScoreRatioSum / totalAttempts) * 100) 
    : 0;

  const avgTimePerQuestionSec = totalQuestionsAnswered > 0 
    ? Math.round(totalTimeSum / totalQuestionsAnswered) 
    : 45;

  const subjectAnalytics: Record<string, { nameHi: string; nameEn: string; attempted: number; correct: number; accuracy: number }> = {};
  const bestSubjectsArray: Array<{ subjectKey: string; nameHi: string; accuracy: number }> = [];

  Object.entries(subjectMap).forEach(([k, v]) => {
    const acc = v.attempted > 0 ? Math.round((v.correct / v.attempted) * 100) : 0;
    subjectAnalytics[k] = {
      nameHi: v.nameHi,
      nameEn: v.nameEn,
      attempted: v.attempted,
      correct: v.correct,
      accuracy: acc
    };
    if (v.attempted >= 2) {
      bestSubjectsArray.push({ subjectKey: k, nameHi: v.nameHi, accuracy: acc });
    }
  });

  bestSubjectsArray.sort((a, b) => b.accuracy - a.accuracy);

  // Weak topics (where failure rate >= 40% and total attempts >= 1)
  const weakTopics = Object.entries(topicTally)
    .filter(([_, v]) => v.total > 0 && (v.incorrect / v.total) >= 0.35)
    .map(([topic, v]) => ({
      topic,
      topicHi: v.topicHi,
      total: v.total,
      incorrect: v.incorrect,
      failureRate: Math.round((v.incorrect / v.total) * 100)
    }))
    .sort((a, b) => b.failureRate - a.failureRate)
    .slice(0, 8);

  const recentScores = attempts.slice(0, 5).map(att => ({
    paperTitle: att.paperTitle,
    date: new Date(att.timestamp).toLocaleDateString('hi-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    score: att.score,
    maxScore: att.maxScore,
    accuracy: att.accuracy
  }));

  return {
    totalAttempts,
    constableAttempts,
    upsiAttempts,
    petAttempts,
    upcatAttempts,
    ctetAttempts,
    totalQuestionsAnswered,
    overallAccuracy,
    averageScorePercent,
    avgTimePerQuestionSec,
    subjectAnalytics,
    weakTopics,
    bestSubjects: bestSubjectsArray,
    recentScores
  };
};
