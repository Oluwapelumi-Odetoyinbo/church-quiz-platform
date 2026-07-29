export interface StartSessionRequest {
  displayName: string;
  avatarUrl: string;
  ageGroupId: string;
  categoryId: string;
  /** Reuse student on replay so no-repeat applies across sessions. */
  studentId?: string;
  classCode?: string;
}

export interface StartSessionResponse {
  sessionToken: string;
  studentId: string;
  attemptId: string;
  expiresAt: string;
  timeLimitSeconds: number;
}
