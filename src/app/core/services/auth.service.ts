import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  /** Observable stream of authentication state */
  readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /** Store a JWT token in localStorage */
  storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isLoggedInSubject.next(true);
  }

  /** Retrieve the stored JWT token */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Clear the stored JWT token */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedInSubject.next(false);
  }

  /** Check if a user is currently logged in */
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
