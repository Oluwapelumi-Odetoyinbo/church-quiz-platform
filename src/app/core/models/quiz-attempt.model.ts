export interface QuizAttempt {
  id: string;
  studentId: string;
  categoryId: string;
  startedAt: Date;
  completedAt: Date | null;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionIndex: number;
}
