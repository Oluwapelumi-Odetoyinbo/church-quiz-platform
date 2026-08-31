export interface Student {
  id: string;
  studentId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  username: string;
  ageGroupId?: string;
  registeredAt?: Date;
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
  user: User;
}

export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface UsernameAvailabilityResponse {
  available: boolean;
  username?: string;
  message?: string;
}
