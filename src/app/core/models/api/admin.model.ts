export interface DashboardMetrics {
  totalStudents: number;
  activeLeaders: number;
  questionsInBank: number;
  flagsThisWeek: number;
}

export interface StaffUser {
  userId: string;
  email: string;
  role: 'admin' | 'leader' | string;
  displayName: string | null;
  groupId: string | null;
}

export interface StaffSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string | null;
  user: StaffUser;
}

export interface AdminAuthStatus {
  needsSetup: boolean;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminSetupRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface ActivityPoint {
  date: string;
  quizzesCompleted: number;
}

export interface ActivityResponse {
  points: ActivityPoint[];
}

export interface AnalyticsSummary {
  totalAttempts: number;
  submittedAttempts: number;
  averageScore: number | null;
  byStatus: Record<string, number>;
}

export interface AuditLogItem {
  id: string;
  action: string;
  title: string;
  actorDisplayName: string | null;
  createdAt: string;
  entityType?: string;
  entityId?: string | null;
}

export interface AuditLogsResponse {
  items: AuditLogItem[];
}

export interface AdminCategory {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface AdminAgeGroup {
  id: string;
  name: string;
  min_age: number;
  max_age: number;
}

export interface AdminLeader {
  id: string;
  email: string | null;
  displayName: string | null;
  role: string;
  groupId: string | null;
  groupName: string | null;
  status: string;
}

export interface AdminQuestion {
  id: string;
  prompt: string;
  categoryId: string;
  ageGroupId: string;
  difficulty: string;
  status: string;
  createdAt: string;
}

export interface QuestionListResponse {
  items: AdminQuestion[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClassCode {
  code: string;
  groupId: string;
  groupName: string | null;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

export interface AdminSearchResponse {
  students: { id: string; label: string; meta?: string }[];
  leaders: { id: string; label: string; meta?: string }[];
  questions: { id: string; label: string; meta?: string }[];
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface CreateAgeGroupRequest {
  name: string;
  minAge: number;
  maxAge: number;
}

export interface CreateClassCodeRequest {
  code: string;
  groupId?: string;
  groupName?: string;
  isActive?: boolean;
  expiresAt?: string;
}

export interface InviteLeaderRequest {
  email: string;
  displayName?: string;
  groupId?: string;
}
