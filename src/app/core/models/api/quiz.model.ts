export interface QuizChoiceDto {
  id: string;
  text: string;
}

export interface QuizQuestionDto {
  attemptId: string;
  slotNumber: number;
  questionId: string;
  prompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimitSeconds: number;
  choices: QuizChoiceDto[];
}

export interface QuizLoadResponse {
  attemptId: string;
  status: string;
  timeLimitSeconds: number;
  questions: QuizQuestionDto[];
}

export interface SaveAnswerRequest {
  attemptId: string;
  questionId: string;
  selectedChoiceId?: string | null;
}

export interface SaveAnswerResponse {
  saved: boolean;
  attemptId: string;
  questionId: string;
}

export interface ReviewItemDto {
  questionId: string;
  prompt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  selectedChoiceId: string | null;
  selectedChoiceText: string | null;
  correctChoiceId: string;
  correctChoiceText: string;
  isCorrect: boolean;
  explanation: string;
}

export interface DifficultyBreakdown {
  easy: string;
  medium: string;
  hard: string;
}

export interface SubmitQuizResponse {
  attemptId: string;
  totalScore: number;
  maxScore: number;
  difficultyBreakdown: DifficultyBreakdown;
  difficultyBreakdownDisplay: string;
  status: string;
  review: ReviewItemDto[];
}
