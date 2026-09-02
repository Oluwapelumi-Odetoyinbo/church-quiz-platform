export interface StudentUser {
  studentId: string;
  firstName: string;
  lastName: string;
  username: string;
}

export interface User {
  id?: string;
  userId?: string;
  studentId?: string;
  email?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  displayName?: string | null;
  role?: 'admin' | 'leader' | 'student' | string;
  groupId?: string | null;
  age?: number;
  ageGroup?: string;
  createdAt?: string;
}

export interface UserSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string | null;
  user: StudentUser | User;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UsernameAvailabilityResponse {
  available: boolean;
  username?: string;
  message?: string;
}

