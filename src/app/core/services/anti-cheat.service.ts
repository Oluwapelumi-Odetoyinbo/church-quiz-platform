import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { AntiCheatResponse } from '../models/api';
import { ApiService } from './api.service';
import { StudentSessionService } from './student-session.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AntiCheatService {
  private readonly api = inject(ApiService);
  private readonly session = inject(StudentSessionService);

  reportTabSwitch(attemptId: string): Observable<AntiCheatResponse> {
    return this.api.post<AntiCheatResponse>('/anti-cheat/tab-switch', { attemptId });
  }

  reportPageUnload(attemptId: string): Observable<AntiCheatResponse> {
    return this.api.post<AntiCheatResponse>('/anti-cheat/page-unload', { attemptId });
  }

  /** Fire-and-forget for beforeunload using sendBeacon. */
  beaconPageUnload(attemptId: string): void {
    const token = this.session.getToken();
    const url = `${environment.apiBaseUrl}/anti-cheat/page-unload`;
    const body = JSON.stringify({ attemptId });

    if (token) {
      void fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body,
        keepalive: true
      });
      return;
    }

    void fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body,
      keepalive: true
    });
  }
}
