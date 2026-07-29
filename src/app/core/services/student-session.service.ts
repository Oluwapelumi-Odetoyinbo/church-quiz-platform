import { Injectable } from '@angular/core';

import type { SubmitQuizResponse } from '../models/api';

export interface StudentProfile {
  displayName: string;
  avatarUrl: string;
  avatarEmoji: string;
  classCode?: string;
}

export interface CatalogSelection {
  ageGroupId: string;
  ageGroupName: string;
  categoryId?: string;
  categoryName?: string;
}

export interface QuizSession {
  sessionToken: string;
  studentId: string;
  attemptId: string;
  expiresAt: string;
  timeLimitSeconds: number;
}

interface SessionState {
  profile: StudentProfile | null;
  catalog: CatalogSelection | null;
  session: QuizSession | null;
  result: SubmitQuizResponse | null;
  /** Survives clearAttempt() so replay can reuse the same student for no-repeat. */
  studentId: string | null;
}

const STORAGE_KEY = 'church_quiz_student_session';

@Injectable({
  providedIn: 'root'
})
export class StudentSessionService {
  private state: SessionState = this.loadState();

  setProfile(profile: StudentProfile): void {
    this.state.profile = profile;
    this.persist();
  }

  getProfile(): StudentProfile | null {
    return this.state.profile;
  }

  setCatalogSelection(catalog: CatalogSelection): void {
    this.state.catalog = { ...this.state.catalog, ...catalog };
    this.persist();
  }

  getCatalogSelection(): CatalogSelection | null {
    return this.state.catalog;
  }

  setSession(session: QuizSession): void {
    this.state.session = session;
    this.state.studentId = session.studentId;
    this.state.result = null;
    this.persist();
  }

  getSession(): QuizSession | null {
    return this.state.session;
  }

  /** Stable student id across play-again (survives clearAttempt). */
  getStudentId(): string | null {
    return this.state.studentId ?? this.state.session?.studentId ?? null;
  }

  getToken(): string | null {
    if (!this.isSessionValid()) {
      return null;
    }

    return this.state.session?.sessionToken ?? null;
  }

  getAttemptId(): string | null {
    return this.state.session?.attemptId ?? null;
  }

  getTimeLimitSeconds(): number {
    return this.state.session?.timeLimitSeconds ?? 30;
  }

  setResult(result: SubmitQuizResponse): void {
    this.state.result = result;
    this.persist();
  }

  getResult(): SubmitQuizResponse | null {
    return this.state.result;
  }

  isSessionValid(): boolean {
    const session = this.state.session;

    if (!session?.sessionToken || !session.attemptId) {
      return false;
    }

    if (!session.expiresAt) {
      return true;
    }

    return new Date(session.expiresAt).getTime() > Date.now();
  }

  hasProfile(): boolean {
    return !!this.state.profile?.displayName && !!this.state.profile?.avatarUrl;
  }

  /** Drop stable student id (e.g. new child on landing). */
  clearStudentId(): void {
    this.state.studentId = null;
    this.persist();
  }

  /** Clears the active attempt/result but keeps name, avatar, age group, and studentId. */
  clearAttempt(): void {
    this.state = {
      ...this.state,
      session: null,
      result: null,
      catalog: this.state.catalog
        ? {
            ageGroupId: this.state.catalog.ageGroupId,
            ageGroupName: this.state.catalog.ageGroupName
          }
        : null
    };
    this.persist();
  }

  clear(): void {
    this.state = {
      profile: null,
      catalog: null,
      session: null,
      result: null,
      studentId: null
    };
    sessionStorage.removeItem(STORAGE_KEY);
  }

  private persist(): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  private loadState(): SessionState {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return {
          profile: null,
          catalog: null,
          session: null,
          result: null,
          studentId: null
        };
      }

      const parsed = JSON.parse(raw) as SessionState;
      return {
        profile: parsed.profile ?? null,
        catalog: parsed.catalog ?? null,
        session: parsed.session ?? null,
        result: parsed.result ?? null,
        studentId: parsed.studentId ?? parsed.session?.studentId ?? null
      };
    } catch {
      return {
        profile: null,
        catalog: null,
        session: null,
        result: null,
        studentId: null
      };
    }
  }
}
