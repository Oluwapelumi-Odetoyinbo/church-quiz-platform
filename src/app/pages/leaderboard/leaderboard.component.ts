import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import type {
  AgeGroupDto,
  LeaderboardCurrentStudentDto,
  LeaderboardEntryDto,
  LeaderboardPeriod,
  LeaderboardScope
} from '../../core/models/api';
import { CatalogService } from '../../core/services/catalog.service';
import { LeaderboardApiService } from '../../core/services/leaderboard-api.service';
import { StudentSessionService } from '../../core/services/student-session.service';
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
  private readonly catalogApi = inject(CatalogService);
  private readonly leaderboardApi = inject(LeaderboardApiService);
  private readonly session = inject(StudentSessionService);

  selectedTab: TabId = 'age';
  period: LeaderboardPeriod = 'week';
  selectedAgeGroupId = 'all';
  ageGroups: AgeGroupDto[] = [];
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

    this.selectedTab = this.profile?.classCode ? 'class' : 'age';
    this.loadAgeGroups();
    this.loadLeaderboard();
  }

  selectTab(tab: TabId): void {
    this.selectedTab = tab;
    this.loadLeaderboard();
  }

  setPeriod(period: LeaderboardPeriod): void {
    this.period = period;
    this.loadLeaderboard();
  }

  setAgeGroup(ageGroupId: string): void {
    this.selectedAgeGroupId = ageGroupId;
    this.loadLeaderboard();
  }

  retryLeaderboard(): void {
    this.loadAgeGroups();
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

  get ageGroupOptions(): Array<{ id: string; name: string }> {
    return [{ id: 'all', name: 'All Age Groups' }, ...this.ageGroups.map((group) => ({ id: group.id, name: group.name }))];
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

  private loadAgeGroups(): void {
    this.catalogApi.getAgeGroups().subscribe({
      next: (groups) => {
        this.ageGroups = groups;
        if (this.selectedAgeGroupId === 'all') {
          const savedAgeGroupId = this.session.getCatalogSelection()?.ageGroupId;
          if (savedAgeGroupId && groups.some((group) => group.id === savedAgeGroupId)) {
            this.selectedAgeGroupId = savedAgeGroupId;
          }
        }
      },
      error: () => {
        this.error = 'Unable to load leaderboard filters right now. Please try again.';
        this.entries = [];
        this.currentStudent = null;
        this.loading = false;
      }
    });
  }

  private loadLeaderboard(): void {
    this.loading = true;
    this.error = '';

    const scope = this.scopeFromTab(this.selectedTab);
    const catalog = this.session.getCatalogSelection();
    const profile = this.session.getProfile();

    if (scope === 'category' && !catalog?.categoryId) {
      this.error = 'Pick a category during the quiz flow to view this leaderboard.';
      this.entries = [];
      this.currentStudent = null;
      this.loading = false;
      return;
    }

    const query = {
      scope,
      period: this.period,
      ...(this.selectedAgeGroupId && this.selectedAgeGroupId !== 'all' ? { ageGroupId: this.selectedAgeGroupId } : {}),
      ...(scope === 'category' && catalog?.categoryId ? { categoryId: catalog.categoryId } : {}),
      ...(scope === 'class' && profile?.classCode ? { classCode: profile.classCode } : {})
    };

    this.leaderboardApi.getLeaderboard(query).subscribe({
      next: (response) => {
        this.entries = response.entries ?? [];
        this.currentStudent = response.currentStudent ?? null;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load leaderboard data right now. Please try again.';
        this.entries = [];
        this.currentStudent = null;
        this.loading = false;
      }
    });
  }
}
