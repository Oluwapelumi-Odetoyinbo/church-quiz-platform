import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import type { ReviewItemDto, SubmitQuizResponse } from '../../core/models/api';
import { QuizApiService } from '../../core/services/quiz-api.service';
import { StudentSessionService } from '../../core/services/student-session.service';
import { getHttpErrorMessage } from '../../core/interceptors/error.interceptor';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ScoreRingComponent } from '../../shared/components/score-ring/score-ring.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CardComponent, ButtonComponent, ScoreRingComponent, NgClass, LoadingSpinnerComponent],
  templateUrl: './results.component.html'
})
export class ResultsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizApi = inject(QuizApiService);
  private readonly session = inject(StudentSessionService);

  readonly attemptId = signal(this.route.snapshot.paramMap.get('attemptId') ?? '');
  readonly result = signal<SubmitQuizResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  readonly correctCount = computed(() => this.result()?.totalScore ?? 0);
  readonly totalCount = computed(() => this.result()?.maxScore ?? 0);
  readonly review = computed(() => this.result()?.review ?? []);
  readonly scorePercent = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.correctCount() / total) * 100);
  });

  readonly difficultyChips = computed(() => {
    const breakdown = this.result()?.difficultyBreakdown;
    if (!breakdown) return [];

    return [
      { label: `Easy ${breakdown.easy}`, className: 'bg-violet-50 text-violet-700' },
      { label: `Medium ${breakdown.medium}`, className: 'bg-amber-50 text-amber-700' },
      { label: `Hard ${breakdown.hard}`, className: 'bg-orange-50 text-orange-700' }
    ];
  });

  readonly isKidsLayout = computed(() => {
    const name = this.session.getCatalogSelection()?.ageGroupName ?? '';
    return name.includes('7-9') || name.includes('10-12');
  });

  readonly resultTitle = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 'Quiz complete';

    const percentage = this.scorePercent();
    if (percentage === 100) return 'Perfect score';
    if (percentage >= 90) return 'Outstanding';
    if (percentage >= 75) return 'Great job';
    if (percentage >= 60) return 'Well done';
    if (percentage >= 40) return 'Keep practicing';
    return "Don't give up";
  });

  readonly resultSubtitle = computed(() => {
    const total = this.totalCount();
    if (total === 0) return '';

    const percentage = this.scorePercent();
    if (percentage === 100) return 'You answered every question correctly.';
    if (percentage >= 90) return 'You have an excellent understanding.';
    if (percentage >= 75) return "You're doing really well.";
    if (percentage >= 60) return "A little more practice and you'll improve even more.";
    if (percentage >= 40) return 'Review the questions you missed and try again.';
    return 'Retry the missed questions and keep learning!';
  });

  ngOnInit(): void {
    const attemptId = this.attemptId();
    if (!attemptId) {
      void this.router.navigate(['/']);
      return;
    }

    const cached = this.session.getResult();
    if (cached && cached.attemptId === attemptId) {
      this.result.set(cached);
      this.loading.set(false);
      return;
    }

    this.quizApi.getReview(attemptId).subscribe({
      next: (review) => {
        this.result.set(review);
        this.session.setResult(review);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(getHttpErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  playAgain(): void {
    const ageGroupId = this.session.getCatalogSelection()?.ageGroupId;
    this.session.clearAttempt();

    if (ageGroupId && this.session.hasProfile()) {
      void this.router.navigate(['/category', ageGroupId]);
      return;
    }

    if (this.session.hasProfile()) {
      void this.router.navigate(['/age-group']);
      return;
    }

    this.session.clear();
    void this.router.navigate(['/']);
  }

  viewLeaderboard(): void {
    void this.router.navigate(['/leaderboard']);
  }

  trackReview(_: number, item: ReviewItemDto): string {
    return item.questionId;
  }
}
