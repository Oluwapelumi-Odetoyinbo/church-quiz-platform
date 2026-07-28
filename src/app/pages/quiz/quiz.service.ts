import { Injectable } from '@angular/core';

import { QuizAgeGroup, QuizQuestion } from '../../core/models/quiz-question.model';
import { MOCK_QUIZ_QUESTIONS } from './mock-question-data';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  // TODO: Replace this mock question source with an AI-backed question endpoint.
  getQuestionsForAgeGroup(ageGroup: QuizAgeGroup | string | null | undefined): QuizQuestion[] {
    if (!ageGroup || !this.isQuizAgeGroup(ageGroup)) {
      return [];
    }

    return MOCK_QUIZ_QUESTIONS[ageGroup].map((question) => ({ ...question }));
  }

  private isQuizAgeGroup(value: string): value is QuizAgeGroup {
    return value === '7-9' || value === '10-12' || value === '13-15' || value === '16-18';
  }
}