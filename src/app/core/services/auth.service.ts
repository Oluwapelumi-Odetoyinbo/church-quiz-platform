import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type { StaffSession, StaffUser } from '../models/api';
import type { LoginRequest, SignUpRequest, User, UserSession, UsernameAvailabilityResponse } from '../models';
import { ApiService } from './api.service';

export type AuthUser = User & Partial<StaffUser>;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly api = inject(ApiService);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_KEY = 'auth_refresh_token';
  private readonly EXPIRES_KEY = 'auth_expires_at';
  private readonly USER_KEY = 'auth_user';

  private readonly APP_TOKEN_KEY = 'app_auth_token';
  private readonly APP_REFRESH_KEY = 'app_auth_refresh_token';
  private readonly APP_EXPIRES_KEY = 'app_auth_expires_at';
  private readonly APP_USER_KEY = 'app_auth_user';

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.readUser());

  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();
  readonly user$ = this.userSubject.asObservable();

  /** Persist a full staff session from admin login/setup. */
  storeSession(session: StaffSession | UserSession): void {
    const user = session.user as Partial<AuthUser>;
    const isStaffUser = 'role' in user || 'displayName' in user || 'groupId' in user;

    if (isStaffUser) {
      const staffSession = session as StaffSession;
      const normalizedUser: AuthUser = {
        id: (staffSession.user as StaffUser).userId,
        userId: (staffSession.user as StaffUser).userId,
        email: staffSession.user.email,
        username: (staffSession.user as StaffUser).displayName || staffSession.user.email,
        displayName: (staffSession.user as StaffUser).displayName,
        role: (staffSession.user as StaffUser).role,
        groupId: (staffSession.user as StaffUser).groupId,
        createdAt: undefined
      };

      localStorage.setItem(this.TOKEN_KEY, staffSession.accessToken);
      localStorage.setItem(this.REFRESH_KEY, staffSession.refreshToken);
      if (staffSession.expiresAt) {
        localStorage.setItem(this.EXPIRES_KEY, staffSession.expiresAt);
      } else {
        localStorage.removeItem(this.EXPIRES_KEY);
      }
      localStorage.setItem(this.USER_KEY, JSON.stringify(normalizedUser));
      this.userSubject.next(normalizedUser);
      this.isLoggedInSubject.next(true);
      return;
    }

    const appSession = session as UserSession;
    const normalizedUser: AuthUser = this.normalizeAppUser(appSession.user);

    localStorage.setItem(this.APP_TOKEN_KEY, appSession.accessToken);
    if (appSession.refreshToken) {
      localStorage.setItem(this.APP_REFRESH_KEY, appSession.refreshToken);
    } else {
      localStorage.removeItem(this.APP_REFRESH_KEY);
    }
    if (appSession.expiresAt) {
      localStorage.setItem(this.APP_EXPIRES_KEY, appSession.expiresAt);
    } else {
      localStorage.removeItem(this.APP_EXPIRES_KEY);
    }
    localStorage.setItem(this.APP_USER_KEY, JSON.stringify(normalizedUser));
    this.userSubject.next(normalizedUser);
    this.isLoggedInSubject.next(true);
  }

  /** @deprecated Prefer storeSession — kept for compatibility */
  storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isLoggedInSubject.next(true);
  }

  signupUser(body: SignUpRequest): Observable<UserSession> {
    return this.api.post<UserSession>('/auth/signup', body);
  }

  loginUser(body: LoginRequest): Observable<UserSession> {
    return this.api.post<UserSession>('/auth/login', body);
  }

  checkUsernameAvailability(username: string): Observable<boolean> {
    const cleaned = username.trim();

    if (!cleaned) {
      return of(false);
    }

    const params = new HttpParams().set('username', cleaned);

    return this.api.get<UsernameAvailabilityResponse | { available?: boolean; exists?: boolean } | null>(`/auth/check-username`, params).pipe(
      map((response) => {
        if (!response) {
          return !this.isReservedUsername(cleaned);
        }

        if (typeof response.available === 'boolean') {
          return response.available;
        }

        if (typeof response.exists === 'boolean') {
          return !response.exists;
        }

        return !this.isReservedUsername(cleaned);
      }),
      catchError(() => of(!this.isReservedUsername(cleaned)))
    );
  }

  getToken(): string | null {
    if (!this.hasValidSession()) {
      return null;
    }

    return localStorage.getItem(this.TOKEN_KEY) ?? localStorage.getItem(this.APP_TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    return this.userSubject.value ?? this.readUser();
  }

  getCurrentUserId(): string | null {
    const user = this.getUser();
    if (!user) {
      return null;
    }

    return user.userId ?? user.id ?? null;
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.EXPIRES_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.APP_TOKEN_KEY);
    localStorage.removeItem(this.APP_REFRESH_KEY);
    localStorage.removeItem(this.APP_EXPIRES_KEY);
    localStorage.removeItem(this.APP_USER_KEY);
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasValidSession();
  }

  private hasValidSession(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY) ?? localStorage.getItem(this.APP_TOKEN_KEY);
    if (!token) {
      return false;
    }

    const expiresAt = localStorage.getItem(this.EXPIRES_KEY) ?? localStorage.getItem(this.APP_EXPIRES_KEY);
    if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
      this.clearToken();
      return false;
    }

    return true;
  }

  private readUser(): AuthUser | null {
    try {
      const rawAppUser = localStorage.getItem(this.APP_USER_KEY);
      if (rawAppUser) {
        return JSON.parse(rawAppUser) as User;
      }

      const rawAdminUser = localStorage.getItem(this.USER_KEY);
      if (!rawAdminUser) {
        return null;
      }
      return JSON.parse(rawAdminUser) as AuthUser;
    } catch {
      return null;
    }
  }

  private buildMockUserSession(user: User): UserSession {
    const normalizedUser = this.normalizeAppUser(user);
    return {
      accessToken: `mock-access-token-${normalizedUser.id ?? normalizedUser.studentId ?? 'guest'}`,
      refreshToken: `mock-refresh-token-${normalizedUser.id ?? normalizedUser.studentId ?? 'guest'}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: normalizedUser
    };
  }

  private normalizeAppUser(user: Partial<User>): AuthUser {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

    const normalized: AuthUser = {
      id: user.studentId ?? user.userId ?? user.id ?? `user-${String(user.username ?? 'guest')}`,
      userId: user.studentId ?? user.userId ?? user.id ?? `user-${String(user.username ?? 'guest')}`,
      studentId: user.studentId ?? user.id ?? user.userId,
      email: user.email ?? `${user.username ?? 'student'}@example.com`,
      username: user.username ?? 'student',
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName ?? (fullName || user.username || 'Student'),
      role: user.role ?? 'student',
      createdAt: user.createdAt
    };

    return normalized;
  }

  private makeMockUserId(username: string): string {
    const clean = username.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `user-${clean || 'guest'}-${Date.now()}`;
  }

  private isReservedUsername(username: string): boolean {
    const reserved = new Set(['admin', 'demo', 'guest', 'root', 'test']);
    return reserved.has(username.trim().toLowerCase());
  }
}
