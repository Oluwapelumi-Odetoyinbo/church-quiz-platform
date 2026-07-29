import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import type { StaffSession, StaffUser } from '../models/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_KEY = 'auth_refresh_token';
  private readonly EXPIRES_KEY = 'auth_expires_at';
  private readonly USER_KEY = 'auth_user';

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  private readonly userSubject = new BehaviorSubject<StaffUser | null>(this.readUser());

  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();
  readonly user$ = this.userSubject.asObservable();

  /** Persist a full staff session from login/setup. */
  storeSession(session: StaffSession): void {
    localStorage.setItem(this.TOKEN_KEY, session.accessToken);
    localStorage.setItem(this.REFRESH_KEY, session.refreshToken);
    if (session.expiresAt) {
      localStorage.setItem(this.EXPIRES_KEY, session.expiresAt);
    } else {
      localStorage.removeItem(this.EXPIRES_KEY);
    }
    localStorage.setItem(this.USER_KEY, JSON.stringify(session.user));
    this.userSubject.next(session.user);
    this.isLoggedInSubject.next(true);
  }

  /** @deprecated Prefer storeSession — kept for compatibility */
  storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isLoggedInSubject.next(true);
  }

  getToken(): string | null {
    if (!this.hasValidSession()) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): StaffUser | null {
    return this.userSubject.value;
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.EXPIRES_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasValidSession();
  }

  private hasValidSession(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) {
      return false;
    }

    const expiresAt = localStorage.getItem(this.EXPIRES_KEY);
    if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
      this.clearToken();
      return false;
    }

    return true;
  }

  private readUser(): StaffUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as StaffUser) : null;
    } catch {
      return null;
    }
  }
}
