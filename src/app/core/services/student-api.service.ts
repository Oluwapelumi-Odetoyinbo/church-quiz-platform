import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { StartSessionRequest, StartSessionResponse } from '../models/api';
import { ApiService } from './api.service';

export interface SubjectProgressResponse {
  completedCategoryIds: string[];
  availableCategoryIds: string[];
  allSubjectsCompleted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StudentApiService {
  private readonly api = inject(ApiService);

  start(body: StartSessionRequest): Observable<StartSessionResponse> {
    return this.api.post<StartSessionResponse>('/students/start', body);
  }

  getProgress(): Observable<SubjectProgressResponse> {
    return this.api.get<SubjectProgressResponse>('/students/me/progress');
  }
}
