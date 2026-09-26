export type ExamCategory = 'constable' | 'upsi' | 'pet' | 'upcat' | 'ctet';

export type SubjectType = 
  | 'gk' 
  | 'hindi' 
  | 'maths' 
  | 'reasoning' 
  | 'mool_vidhi'
  | 'cdp'
  | 'evs'
  | 'english'
  | 'science'
  | 'social_studies';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  paperId: string;
  questionNumber: number;
  subject: SubjectType;
  subjectNameHi: string;
  subjectNameEn: string;
  topic: string;
  topicHi: string;
  difficulty: DifficultyLevel;
  textHi: string;
  textEn: string;
  optionsHi: [string, string, string, string];
  optionsEn: [string, string, string, string];
  correctOption: number; // 0, 1, 2, 3
  explanationHi: string;
  explanationEn: string;
}

export interface PaperMeta {
  id: string;
  category: ExamCategory;
  year: number;
  examName: string;
  examNameHi: string;
  postName: string;
  postNameHi: string;
  examDate: string;
  shift: string;
  shiftHi: string;
  paperCode: string;
  paperType?: 'Paper 1' | 'Paper 2' | 'Combined';
  paperTypeHi?: string;
  session?: string;
  setCode?: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  markingScheme: {
    positive: number;
    negative: number;
    sectionalCutoffPercent?: number;
    overallCutoffPercent?: number;
    note: string;
  };
  verifiedSource: string;
  sourceType: 'Official CBSE / CTET Master Archive' | 'Official UPPBPB Master Paper' | 'Official UPSSSC Master Paper' | 'Official UP CAT Master Paper' | 'Official Answer Key Verified' | 'Public Examination Archive';
  lastVerifiedDate: string;
  verificationNotes: string;
  questions: Question[];
}

export type QuestionStatus = 'unvisited' | 'not_answered' | 'answered' | 'marked' | 'answered_marked';

export interface TestAttempt {
  id: string;
  paperId: string;
  paperTitle: string;
  category: ExamCategory;
  timestamp: number;
  timeTakenSeconds: number;
  answers: Record<string, number>; // questionId -> selectedOption (0..3)
  statuses: Record<string, QuestionStatus>;
  score: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy: number;
  sectionalScores: Record<SubjectType, {
    correct: number;
    incorrect: number;
    unattempted: number;
    score: number;
    maxScore: number;
    passed?: boolean;
  }>;
  topicStats: Record<string, { correct: number; incorrect: number; total: number }>;
}

export type AppView = 
  | 'dashboard' 
  | 'mock_test' 
  | 'practice' 
  | 'view_paper' 
  | 'test_result' 
  | 'analytics' 
  | 'mistake_notebook'
  | 'bookmarks';

export type PracticeFilterType = 
  | 'all' 
  | 'subject' 
  | 'topic' 
  | 'year' 
  | 'random' 
  | 'mixed' 
  | 'weak_topic';
