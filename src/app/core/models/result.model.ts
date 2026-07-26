export interface Result {
  id: string;
  quizAttemptId: string;
  studentId: string;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
}
