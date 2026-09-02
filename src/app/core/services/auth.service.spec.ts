import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import type { LoginRequest, SignUpRequest } from '../models/student.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends the signup payload expected by the backend and stores the session', () => {
    const payload: SignUpRequest = {
      firstName: 'Paul',
      lastName: 'Smith',
      username: 'paul123',
      password: 'SecurePass1'
    };

    service.signupUser(payload).subscribe((session) => {
      expect(session.user.username).toBe('paul123');
    });

    const req = httpMock.expectOne('https://church-quiz-api.onrender.com/auth/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({
      accessToken: 'access-token',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      user: {
        studentId: 'student-123',
        firstName: 'Paul',
        lastName: 'Smith',
        username: 'paul123'
      }
    });
  });

  it('sends the login payload using username', () => {
    const payload: LoginRequest = {
      username: 'paul123',
      password: 'SecurePass1'
    };

    service.loginUser(payload).subscribe((session) => {
      expect(session.user.username).toBe('paul123');
    });

    const req = httpMock.expectOne('https://church-quiz-api.onrender.com/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({
      accessToken: 'access-token',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      user: {
        studentId: 'student-123',
        firstName: 'Paul',
        lastName: 'Smith',
        username: 'paul123'
      }
    });
  });
});
