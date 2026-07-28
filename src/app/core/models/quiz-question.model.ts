export interface QuizQuestion {
  id: number;
  ageGroup: '7-9' | '10-12' | '13-15' | '16-18';
  subject: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  answerType: 'text' | 'math';
  answer: string;
}

export type QuizAgeGroup = QuizQuestion['ageGroup'];