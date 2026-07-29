import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import type { LeaderboardQuery, LeaderboardResponse } from '../models/api';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardApiService {
  private readonly api = inject(ApiService);

  getLeaderboard(query: LeaderboardQuery): Observable<LeaderboardResponse> {
    let params = new HttpParams().set('scope', query.scope);

    if (query.period) {
      params = params.set('period', query.period);
    }
    if (query.ageGroupId) {
      params = params.set('ageGroupId', query.ageGroupId);
    }
    if (query.categoryId) {
      params = params.set('categoryId', query.categoryId);
    }
    if (query.classCode) {
      params = params.set('classCode', query.classCode);
    }

    return this.api.get<LeaderboardResponse>('/leaderboard', params);
  }
}
