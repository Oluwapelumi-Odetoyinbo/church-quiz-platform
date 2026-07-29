import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import type {
  LeaderboardCurrentStudentDto,
  LeaderboardEntryDto,
  LeaderboardScope
} from '../../core/models/api';
import { LeaderboardApiService } from '../../core/services/leaderboard-api.service';
import { StudentSessionService } from '../../core/services/student-session.service';
import { getHttpErrorMessage } from '../../core/interceptors/error.interceptor';
import { CardComponent } from '../../shared/components/card/card.component';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

type TabId = 'class' | 'age' | 'category';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, CardComponent, AppLogoComponent, LoadingSpinnerComponent],
  templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly leaderboardApi = inject(LeaderboardApiService);
  private readonly session = inject(StudentSessionService);

  selectedTab: TabId = 'age';
  period: 'week' | 'all' = 'week';
  loading = false;
  error = '';
  entries: LeaderboardEntryDto[] = [];
  currentStudent: LeaderboardCurrentStudentDto | null = null;

  readonly catalog = this.session.getCatalogSelection();
  readonly profile = this.session.getProfile();

  ngOnInit(): void {
    if (!this.session.isSessionValid()) {
      void this.router.navigate(['/']);
      return;
    }

    // Prefer class tab when the student used a class code
    this.selectedTab = this.profile?.classCode ? 'class' : 'age';
    this.loadLeaderboard();
  }

  selectTab(tab: TabId): void {
    this.selectedTab = tab;
    this.loadLeaderboard();
  }

  setPeriod(period: 'week' | 'all'): void {
    this.period = period;
    this.loadLeaderboard();
  }

  back(): void {
    const attemptId = this.session.getAttemptId();
    if (attemptId) {
      void this.router.navigate(['/results', attemptId]);
      return;
    }
    void this.router.navigate(['/']);
  }

  trackEntry(_: number, entry: LeaderboardEntryDto): string {
    return entry.studentId;
  }

  private scopeFromTab(tab: TabId): LeaderboardScope {
    switch (tab) {
      case 'class':
        return 'class';
      case 'category':
        return 'category';
      default:
        return 'age_group';
    }
  }

  private loadLeaderboard(): void {
    this.loading = true;
    this.error = '';

    const scope = this.scopeFromTab(this.selectedTab);
    const catalog = this.catalog;
    const profile = this.profile;

    if (scope === 'category' && !catalog?.categoryId) {
      this.error = 'Pick a category during the quiz flow to view this leaderboard.';
      this.entries = [];
      this.currentStudent = null;
      this.loading = false;
      return;
    }

    this.leaderboardApi
      .getLeaderboard({
        scope,
        period: this.period,
        ageGroupId: catalog?.ageGroupId,
        categoryId: scope === 'category' ? catalog?.categoryId : undefined,
        classCode: scope === 'class' ? profile?.classCode : undefined
      })
      .subscribe({
        next: (res) => {
          this.entries = res.entries ?? [];
          this.currentStudent = res.currentStudent;
          this.loading = false;
        },
        error: (err) => {
          this.error = getHttpErrorMessage(err);
          this.entries = [];
          this.currentStudent = null;
          this.loading = false;
        }
      });
  }
}
