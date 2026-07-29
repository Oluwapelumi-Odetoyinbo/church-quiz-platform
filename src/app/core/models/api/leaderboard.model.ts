export type LeaderboardScope = 'class' | 'age_group' | 'category';
export type LeaderboardPeriod = 'week' | 'all';

export interface LeaderboardEntryDto {
  rank: number;
  studentId: string;
  displayName: string;
  avatarUrl: string;
  points: number;
  totalScore: number;
  maxScore: number;
  isCurrentStudent: boolean;
}

export interface LeaderboardCurrentStudentDto {
  rank: number;
  points: number;
  totalScore: number;
  maxScore: number;
}

export interface LeaderboardResponse {
  scope: LeaderboardScope | string;
  period: LeaderboardPeriod | string;
  entries: LeaderboardEntryDto[];
  currentStudent: LeaderboardCurrentStudentDto | null;
}

export interface LeaderboardQuery {
  scope: LeaderboardScope;
  ageGroupId?: string;
  categoryId?: string;
  classCode?: string;
  period?: LeaderboardPeriod;
}
