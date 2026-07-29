import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';
import { AdminApiService } from '../../core/services/admin-api.service';
import { getHttpErrorMessage } from '../../core/interceptors/error.interceptor';
import type {
  ActivityPoint,
  AdminAgeGroup,
  AdminCategory,
  AdminLeader,
  AdminQuestion,
  AnalyticsSummary,
  AuditLogItem,
  ClassCode,
  DashboardMetrics
} from '../../core/models/api';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface ChartPoint {
  label: string;
  value: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ButtonComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly adminApi = inject(AdminApiService);

  activeTab = 'dashboard';
  loading = false;
  error = '';
  success = '';
  authLoading = false;

  // Email/password auth (or first-time setup)
  showLogin = !this.auth.isLoggedIn();
  needsSetup = false;
  authEmail = '';
  authPassword = '';
  authDisplayName = '';
  authUserLabel = this.auth.getUser()?.displayName || this.auth.getUser()?.email || 'Staff';

  searchQuery = '';
  searchResults: {
    students: { id: string; label: string }[];
    leaders: { id: string; label: string }[];
    questions: { id: string; label: string }[];
  } | null = null;

  navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'pi pi-home' },
    { id: 'categories', label: 'Categories & Age Bands', icon: 'pi pi-list' },
    { id: 'leaders', label: 'Leaders', icon: 'pi pi-users' },
    { id: 'questions', label: 'Question Bank', icon: 'pi pi-question-circle' },
    { id: 'class-codes', label: 'Class Codes', icon: 'pi pi-key' },
    { id: 'audit', label: 'Audit Log', icon: 'pi pi-file' },
    { id: 'analytics', label: 'Analytics', icon: 'pi pi-chart-line' }
  ];

  metrics: DashboardMetrics | null = null;
  activityPoints: ActivityPoint[] = [];
  auditItems: AuditLogItem[] = [];
  summary: AnalyticsSummary | null = null;

  categories: AdminCategory[] = [];
  ageGroups: AdminAgeGroup[] = [];
  leaders: AdminLeader[] = [];
  questions: AdminQuestion[] = [];
  questionTotal = 0;
  questionPage = 1;
  questionStatus = '';
  classCodes: ClassCode[] = [];

  // Forms
  newCategoryName = '';
  newAgeName = '';
  newAgeMin = 7;
  newAgeMax = 9;
  inviteEmail = '';
  inviteName = '';
  newCode = '';
  newCodeGroupName = '';

  chartPoints: ChartPoint[] = [];
  linePath = '';
  fillPath = '';
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: ChartPoint | null = null;

  ngOnInit(): void {
    if (this.showLogin) {
      this.checkAuthStatus();
      return;
    }

    this.loadTab(this.activeTab);
  }

  private checkAuthStatus(): void {
    this.authLoading = true;
    this.adminApi.getAuthStatus().subscribe({
      next: (status) => {
        this.needsSetup = status.needsSetup;
        this.authLoading = false;
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.authLoading = false;
      }
    });
  }

  submitAuth(): void {
    const email = this.authEmail.trim();
    const password = this.authPassword;

    if (!email || password.length < 8) {
      this.error = 'Enter a valid email and a password of at least 8 characters.';
      return;
    }

    this.authLoading = true;
    this.error = '';

    const request$ = this.needsSetup
      ? this.adminApi.setup({
          email,
          password,
          displayName: this.authDisplayName.trim() || undefined
        })
      : this.adminApi.login({ email, password });

    request$.subscribe({
      next: (session) => {
        this.auth.storeSession(session);
        this.authUserLabel =
          session.user.displayName || session.user.email || 'Staff';
        this.showLogin = false;
        this.authLoading = false;
        this.authPassword = '';
        this.loadTab(this.activeTab);
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.authLoading = false;
      }
    });
  }

  handleLogout(): void {
    this.auth.clearToken();
    this.showLogin = true;
    this.authEmail = '';
    this.authPassword = '';
    this.authDisplayName = '';
    this.metrics = null;
    this.checkAuthStatus();
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    this.error = '';
    this.success = '';
    this.loadTab(tabId);
  }

  getActiveTabLabel(): string {
    return this.navItems.find((i) => i.id === this.activeTab)?.label ?? 'Dashboard';
  }

  onSearch(): void {
    const q = this.searchQuery.trim();
    if (q.length < 1) {
      this.searchResults = null;
      return;
    }

    this.adminApi.search(q).subscribe({
      next: (res) => (this.searchResults = res),
      error: (err) => (this.error = getHttpErrorMessage(err))
    });
  }

  private loadTab(tabId: string): void {
    this.loading = true;
    this.error = '';

    switch (tabId) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'categories':
        this.loadCatalog();
        break;
      case 'leaders':
        this.loadLeaders();
        break;
      case 'questions':
        this.loadQuestions();
        break;
      case 'class-codes':
        this.loadClassCodes();
        break;
      case 'audit':
        this.loadAudit();
        break;
      case 'analytics':
        this.loadAnalytics();
        break;
      default:
        this.loading = false;
    }
  }

  private loadDashboard(): void {
    forkJoin({
      metrics: this.adminApi.getDashboardMetrics().pipe(catchError((e) => { this.error = getHttpErrorMessage(e); return of(null); })),
      activity: this.adminApi.getActivity(30).pipe(catchError(() => of({ points: [] }))),
      audit: this.adminApi.getAuditLogs(8).pipe(catchError(() => of({ items: [] })))
    }).subscribe({
      next: ({ metrics, activity, audit }) => {
        this.metrics = metrics;
        this.activityPoints = activity.points;
        this.auditItems = audit.items;
        this.buildChart(activity.points);
        this.loading = false;
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  private loadCatalog(): void {
    forkJoin({
      categories: this.adminApi.listCategories(),
      ageGroups: this.adminApi.listAgeGroups()
    }).subscribe({
      next: ({ categories, ageGroups }) => {
        this.categories = categories;
        this.ageGroups = ageGroups;
        this.loading = false;
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  private loadLeaders(): void {
    this.adminApi.listLeaders().subscribe({
      next: (leaders) => {
        this.leaders = leaders;
        this.loading = false;
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  loadQuestions(page = 1): void {
    this.loading = true;
    this.questionPage = page;
    this.adminApi
      .listQuestions({
        status: this.questionStatus || undefined,
        page,
        pageSize: 20
      })
      .subscribe({
        next: (res) => {
          this.questions = res.items;
          this.questionTotal = res.total;
          this.loading = false;
        },
        error: (err) => {
          this.error = getHttpErrorMessage(err);
          this.loading = false;
        }
      });
  }

  private loadClassCodes(): void {
    this.adminApi.listClassCodes().subscribe({
      next: (codes) => {
        this.classCodes = codes;
        this.loading = false;
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  private loadAudit(): void {
    this.adminApi.getAuditLogs(50).subscribe({
      next: (res) => {
        this.auditItems = res.items;
        this.loading = false;
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  private loadAnalytics(): void {
    forkJoin({
      summary: this.adminApi.getAnalyticsSummary(),
      activity: this.adminApi.getActivity(30)
    }).subscribe({
      next: ({ summary, activity }) => {
        this.summary = summary;
        this.activityPoints = activity.points;
        this.buildChart(activity.points);
        this.loading = false;
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  createCategory(): void {
    if (!this.newCategoryName.trim()) return;
    this.adminApi.createCategory({ name: this.newCategoryName.trim() }).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.success = 'Category created';
        this.loadCatalog();
      },
      error: (err) => (this.error = getHttpErrorMessage(err))
    });
  }

  deleteCategory(id: string): void {
    if (!confirm('Delete this category?')) return;
    this.adminApi.deleteCategory(id).subscribe({
      next: () => this.loadCatalog(),
      error: (err) => (this.error = getHttpErrorMessage(err))
    });
  }

  createAgeGroup(): void {
    if (!this.newAgeName.trim()) return;
    this.adminApi
      .createAgeGroup({
        name: this.newAgeName.trim(),
        minAge: this.newAgeMin,
        maxAge: this.newAgeMax
      })
      .subscribe({
        next: () => {
          this.newAgeName = '';
          this.success = 'Age group created';
          this.loadCatalog();
        },
        error: (err) => (this.error = getHttpErrorMessage(err))
      });
  }

  deleteAgeGroup(id: string): void {
    if (!confirm('Delete this age group?')) return;
    this.adminApi.deleteAgeGroup(id).subscribe({
      next: () => this.loadCatalog(),
      error: (err) => (this.error = getHttpErrorMessage(err))
    });
  }

  inviteLeader(): void {
    if (!this.inviteEmail.trim()) return;
    this.adminApi
      .inviteLeader({
        email: this.inviteEmail.trim(),
        displayName: this.inviteName.trim() || undefined
      })
      .subscribe({
        next: (res) => {
          this.success = res.note || 'Invite recorded';
          this.inviteEmail = '';
          this.inviteName = '';
          this.loadLeaders();
        },
        error: (err) => (this.error = getHttpErrorMessage(err))
      });
  }

  setQuestionStatus(id: string, action: 'approve' | 'reject' | 'flag'): void {
    const call =
      action === 'approve'
        ? this.adminApi.approveQuestion(id)
        : action === 'reject'
          ? this.adminApi.rejectQuestion(id)
          : this.adminApi.flagQuestion(id);

    call.subscribe({
      next: () => this.loadQuestions(this.questionPage),
      error: (err) => (this.error = getHttpErrorMessage(err))
    });
  }

  generateQuestions(): void {
    this.loading = true;
    this.adminApi.generateQuestions().subscribe({
      next: () => {
        this.success = 'Question generation started / completed';
        this.loadQuestions(1);
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  createClassCode(): void {
    if (!this.newCode.trim() || !this.newCodeGroupName.trim()) return;
    this.adminApi
      .createClassCode({
        code: this.newCode.trim(),
        groupName: this.newCodeGroupName.trim()
      })
      .subscribe({
        next: () => {
          this.newCode = '';
          this.newCodeGroupName = '';
          this.success = 'Class code created';
          this.loadClassCodes();
        },
        error: (err) => (this.error = getHttpErrorMessage(err))
      });
  }

  toggleClassCode(code: ClassCode): void {
    this.adminApi.updateClassCode(code.code, { isActive: !code.isActive }).subscribe({
      next: () => this.loadClassCodes(),
      error: (err) => (this.error = getHttpErrorMessage(err))
    });
  }

  deleteClassCode(code: string): void {
    if (!confirm(`Delete class code ${code}?`)) return;
    this.adminApi.deleteClassCode(code).subscribe({
      next: () => this.loadClassCodes(),
      error: (err) => (this.error = getHttpErrorMessage(err))
    });
  }

  formatDate(value: string): string {
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  }

  showTooltip(point: ChartPoint): void {
    this.tooltipData = point;
    this.tooltipX = point.x - 65;
    this.tooltipY = point.y - 45;
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }

  private buildChart(points: ActivityPoint[]): void {
    if (!points.length) {
      this.chartPoints = [];
      this.linePath = '';
      this.fillPath = '';
      return;
    }

    const maxValue = Math.max(...points.map((p) => p.quizzesCompleted), 1);
    const chartWidth = 600;
    const paddingX = 45;
    const yBottom = 180;
    const yTop = 20;
    const xMin = paddingX;
    const xMax = chartWidth - paddingX;

    this.chartPoints = points.map((p, index) => {
      const x = xMin + (index / Math.max(points.length - 1, 1)) * (xMax - xMin);
      const y = yBottom - (p.quizzesCompleted / maxValue) * (yBottom - yTop);
      return {
        label: p.date.slice(5),
        value: p.quizzesCompleted,
        x: Math.round(x),
        y: Math.round(y)
      };
    });

    this.linePath = this.computeBezierCurve(this.chartPoints);
    if (this.chartPoints.length > 0) {
      const first = this.chartPoints[0];
      const last = this.chartPoints[this.chartPoints.length - 1];
      this.fillPath = `${this.linePath} L ${last.x} 180 L ${first.x} 180 Z`;
    }
  }

  private computeBezierCurve(pts: ChartPoint[]): string {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = p0.x + (p1.x - p0.x) / 2;
      path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  }
}
