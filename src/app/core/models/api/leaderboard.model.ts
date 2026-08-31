export type LeaderboardScope = 'class' | 'age_group' | 'category';
export type LeaderboardPeriod = 'week' | 'month' | 'all';

export interface LeaderboardEntryDto {
  rank: number;
  studentId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  ageGroupId: string | null;
  ageGroup: string | null;
  avatarUrl: string | null;
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
