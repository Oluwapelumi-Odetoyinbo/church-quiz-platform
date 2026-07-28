import { QuizAgeGroup, QuizQuestion } from './quiz-question.model';

export interface QuizQuestionReview {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

export interface QuizAttemptResult {
  ageGroup: QuizAgeGroup;
  reviewedQuestions: QuizQuestionReview[];
  correctCount: number;
  totalCount: number;
}