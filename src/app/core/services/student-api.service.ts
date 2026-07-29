import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { StartSessionRequest, StartSessionResponse } from '../models/api';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentApiService {
  private readonly api = inject(ApiService);

  start(body: StartSessionRequest): Observable<StartSessionResponse> {
    return this.api.post<StartSessionResponse>('/students/start', body);
  }
}
