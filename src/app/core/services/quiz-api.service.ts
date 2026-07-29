import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type {
  QuizLoadResponse,
  SaveAnswerRequest,
  SaveAnswerResponse,
  SubmitQuizResponse
} from '../models/api';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class QuizApiService {
  private readonly api = inject(ApiService);

  getQuiz(attemptId: string): Observable<QuizLoadResponse> {
    return this.api.get<QuizLoadResponse>(`/quiz/${attemptId}`);
  }

  saveAnswer(body: SaveAnswerRequest): Observable<SaveAnswerResponse> {
    return this.api.post<SaveAnswerResponse>('/quiz/save-answer', body);
  }

  submit(attemptId: string): Observable<SubmitQuizResponse> {
    return this.api.post<SubmitQuizResponse>('/quiz/submit', { attemptId });
  }

  getReview(attemptId: string): Observable<SubmitQuizResponse> {
    return this.api.get<SubmitQuizResponse>(`/quiz/${attemptId}/review`);
  }
}
