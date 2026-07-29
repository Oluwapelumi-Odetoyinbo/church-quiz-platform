import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import type {
  ActivityResponse,
  AdminAgeGroup,
  AdminAuthStatus,
  AdminCategory,
  AdminLeader,
  AdminLoginRequest,
  AdminSearchResponse,
  AdminSetupRequest,
  AnalyticsSummary,
  AuditLogsResponse,
  ClassCode,
  CreateAgeGroupRequest,
  CreateCategoryRequest,
  CreateClassCodeRequest,
  DashboardMetrics,
  InviteLeaderRequest,
  QuestionListResponse,
  StaffSession
} from '../models/api';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private readonly api = inject(ApiService);

  getAuthStatus(): Observable<AdminAuthStatus> {
    return this.api.get<AdminAuthStatus>('/admin/auth/status');
  }

  setup(body: AdminSetupRequest): Observable<StaffSession> {
    return this.api.post<StaffSession>('/admin/auth/setup', body);
  }

  login(body: AdminLoginRequest): Observable<StaffSession> {
    return this.api.post<StaffSession>('/admin/auth/login', body);
  }

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.api.get<DashboardMetrics>('/admin/dashboard/metrics');
  }

  getActivity(days = 30): Observable<ActivityResponse> {
    const params = new HttpParams().set('days', String(days));
    return this.api.get<ActivityResponse>('/admin/analytics/activity', params);
  }

  getAnalyticsSummary(): Observable<AnalyticsSummary> {
    return this.api.get<AnalyticsSummary>('/admin/analytics/summary');
  }

  getAuditLogs(limit = 20): Observable<AuditLogsResponse> {
    const params = new HttpParams().set('limit', String(limit));
    return this.api.get<AuditLogsResponse>('/admin/audit-logs', params);
  }

  search(q: string): Observable<AdminSearchResponse> {
    const params = new HttpParams().set('q', q);
    return this.api.get<AdminSearchResponse>('/admin/search', params);
  }

  listCategories(): Observable<AdminCategory[]> {
    return this.api.get<AdminCategory[]>('/admin/categories');
  }

  createCategory(body: CreateCategoryRequest): Observable<AdminCategory> {
    return this.api.post<AdminCategory>('/admin/categories', body);
  }

  updateCategory(id: string, body: Partial<CreateCategoryRequest>): Observable<AdminCategory> {
    return this.api.patch<AdminCategory>(`/admin/categories/${id}`, body);
  }

  deleteCategory(id: string): Observable<{ deleted: boolean; id: string }> {
    return this.api.delete<{ deleted: boolean; id: string }>(`/admin/categories/${id}`);
  }

  listAgeGroups(): Observable<AdminAgeGroup[]> {
    return this.api.get<AdminAgeGroup[]>('/admin/age-groups');
  }

  createAgeGroup(body: CreateAgeGroupRequest): Observable<AdminAgeGroup> {
    return this.api.post<AdminAgeGroup>('/admin/age-groups', body);
  }

  updateAgeGroup(id: string, body: Partial<CreateAgeGroupRequest>): Observable<AdminAgeGroup> {
    return this.api.patch<AdminAgeGroup>(`/admin/age-groups/${id}`, body);
  }

  deleteAgeGroup(id: string): Observable<{ deleted: boolean; id: string }> {
    return this.api.delete<{ deleted: boolean; id: string }>(`/admin/age-groups/${id}`);
  }

  listLeaders(): Observable<AdminLeader[]> {
    return this.api.get<AdminLeader[]>('/admin/leaders');
  }

  inviteLeader(body: InviteLeaderRequest): Observable<{ invited: boolean; email: string; note: string }> {
    return this.api.post('/admin/leaders/invite', body);
  }

  assignLeaderGroup(leaderId: string, groupId: string): Observable<unknown> {
    return this.api.patch(`/admin/leaders/${leaderId}/group`, { groupId });
  }

  listQuestions(filters: {
    status?: string;
    categoryId?: string;
    ageGroupId?: string;
    difficulty?: string;
    page?: number;
    pageSize?: number;
  } = {}): Observable<QuestionListResponse> {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.ageGroupId) params = params.set('ageGroupId', filters.ageGroupId);
    if (filters.difficulty) params = params.set('difficulty', filters.difficulty);
    if (filters.page) params = params.set('page', String(filters.page));
    if (filters.pageSize) params = params.set('pageSize', String(filters.pageSize));
    return this.api.get<QuestionListResponse>('/admin/questions', params);
  }

  approveQuestion(id: string): Observable<{ id: string; status: string }> {
    return this.api.patch(`/admin/questions/${id}/approve`, {});
  }

  rejectQuestion(id: string): Observable<{ id: string; status: string }> {
    return this.api.patch(`/admin/questions/${id}/reject`, {});
  }

  flagQuestion(id: string): Observable<{ id: string; status: string }> {
    return this.api.patch(`/admin/questions/${id}/flag`, {});
  }

  generateQuestions(): Observable<unknown> {
    return this.api.post('/admin/questions/generate', {});
  }

  listClassCodes(): Observable<ClassCode[]> {
    return this.api.get<ClassCode[]>('/admin/class-codes');
  }

  createClassCode(body: CreateClassCodeRequest): Observable<ClassCode> {
    return this.api.post<ClassCode>('/admin/class-codes', body);
  }

  updateClassCode(code: string, body: Partial<{ isActive: boolean; groupId: string; expiresAt: string | null }>): Observable<ClassCode> {
    return this.api.patch<ClassCode>(`/admin/class-codes/${encodeURIComponent(code)}`, body);
  }

  deleteClassCode(code: string): Observable<{ deleted: boolean; id: string }> {
    return this.api.delete<{ deleted: boolean; id: string }>(
      `/admin/class-codes/${encodeURIComponent(code)}`
    );
  }
}
