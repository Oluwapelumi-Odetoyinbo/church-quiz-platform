export interface StartSessionRequest {
  ageGroupId: string;
  categoryId: string;
  avatarUrl?: string;
  classCode?: string;
  /** Optional legacy replay field if the backend supports it. */
  studentId?: string;
}

export interface StartSessionResponse {
  sessionToken: string;
  studentId: string;
  attemptId: string;
  expiresAt: string;
  timeLimitSeconds: number;
}
