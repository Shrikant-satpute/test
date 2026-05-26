// =============================================================================
// TypeScript Interfaces for CA Exam Portal
// NOTE FOR VERCEL DEPLOYMENT: JSON file storage will NOT persist between
// serverless function invocations. Replace fs operations with Vercel KV (Redis)
// or MongoDB Atlas for production. See API routes for specific lines to change.
// =============================================================================

// ─── SPOM System Types ────────────────────────────────────────────────────────

export interface Chapter {
  id: string;
  code: string;
  name: string;
  law: string;
  category: 'companies-act' | 'securities-laws' | 'economic-laws' | 'full-mock';
  totalQuestions: number;
  totalMarks: number;
  passMarks: number;
  duration: number; // minutes
  available: boolean;
  keySections: string[];
}

export interface ChaptersData {
  chapters: Chapter[];
}

export interface SPOMQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  section: string;
}

export interface SPOMScenario {
  scenarioId: string;
  scenarioText: string;
  questions: SPOMQuestion[];
}

export interface SPOMChapterData {
  chapterId: string;
  chapterName: string;
  law: string;
  category: string;
  scenarios: SPOMScenario[];
}

export interface SPOMQuestionResult {
  questionId: number;
  scenarioId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
  explanation: string;
  section: string;
}

export interface SPOMAttempt {
  attemptId: string;
  chapterId: string;
  chapterName: string;
  attemptNumber: number;
  submittedAt: string;
  timeTaken: number; // seconds
  answers: Record<number, string>; // questionId -> selected option
  results: SPOMQuestionResult[];
  score: number;          // questions correct
  totalQuestions: number;
  marksObtained: number;  // score * 2
  totalMarks: number;     // totalQuestions * 2
  percentage: number;
  passed: boolean;
}

export interface SPOMResultsData {
  [username: string]: {
    [chapterId: string]: SPOMAttempt[];
  };
}

export interface ChapterProgress {
  chapterId: string;
  attempted: boolean;
  passed: boolean;
  attempts: number;
  bestScore: number;
  bestPercentage: number;
  lastAttemptedAt: string | null;
}

export interface SPOMSubmitPayload {
  username: string;
  chapterId: string;
  answers: Record<number, string>;
  timeTaken: number;
}

// ─── Legacy CA Intermediate Types (kept for backward compatibility) ───────────

export interface User {
  username: string;
  password: string;
  role: 'student' | 'admin';
}

export interface UsersData {
  users: User[];
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: 'A' | 'B' | 'C' | 'D';
  marks: number;
  difficulty: 'medium' | 'hard' | 'scenario';
}

export interface ShortQuestion {
  id: number;
  question: string;
  modelAnswer: string;
  keywords: string[];
  marks: number;
}

export interface CaseQuestion {
  id: number;
  caseScenario: string;
  question: string;
  modelAnswer: string;
  keywords: string[];
  marks: number;
}

export interface QuestionsData {
  mcq: MCQQuestion[];
  short: ShortQuestion[];
  case: CaseQuestion[];
}

export interface MCQResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
}

export interface ShortResult {
  questionId: number;
  userAnswer: string;
  modelAnswer: string;
  keywordsMatched: string[];
  totalKeywords: number;
  marksAwarded: number;
  maxMarks: number;
}

export interface CaseResult {
  questionId: number;
  userAnswer: string;
  modelAnswer: string;
  caseScenario: string;
  keywordsMatched: string[];
  totalKeywords: number;
  marksAwarded: number;
  maxMarks: number;
}

export interface Attempt {
  attemptId: string;
  attemptNumber: number;
  submittedAt: string;
  mcqAnswers: Record<string, string>; // questionId -> selected option
  shortAnswers: Record<string, string>; // questionId -> text answer
  caseAnswers: Record<string, string>; // questionId -> text answer
  mcqResults: MCQResult[];
  shortResults: ShortResult[];
  caseResults: CaseResult[];
  mcqScore: number;
  shortScore: number;
  caseScore: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
}

export interface ResultsData {
  [username: string]: Attempt[];
}

export interface AdminAttemptRow extends Attempt {
  username: string;
}

export interface SubmitPayload {
  username: string;
  mcqAnswers: Record<string, string>;
  shortAnswers: Record<string, string>;
  caseAnswers: Record<string, string>;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SessionData {
  loggedIn: boolean;
  username: string;
  role: 'student' | 'admin';
  loginTime: string;
}
