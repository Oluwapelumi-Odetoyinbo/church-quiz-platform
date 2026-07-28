import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import type { QuizAgeGroup, QuizQuestion } from '../../core/models/quiz-question.model';
import type { QuizAttemptResult, QuizQuestionReview } from '../../core/models/quiz-result.model';

@Component({
  selector: 'app-results-page',
  standalone: true,
  imports: [CardComponent, ButtonComponent, NgClass],
  templateUrl: './results.component.html'
})
export class ResultsPageComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // TODO: Integrate leaderboard API once backend tracking is available.
  readonly ageGroup = signal<QuizAgeGroup | null>(this.route.snapshot.paramMap.get('ageGroup') as QuizAgeGroup | null);

  readonly quizResult = signal<QuizAttemptResult | null>(this.getQuizResultFromState());

  readonly reviewedQuestions = computed(() => this.quizResult()?.reviewedQuestions ?? []);

  readonly wrongQuestions = computed(() => this.reviewedQuestions().filter((item) => !item.isCorrect).map((item) => item.question));

  readonly correctCount = computed(() => this.quizResult()?.correctCount ?? this.reviewedQuestions().filter((item) => item.isCorrect).length);

  readonly totalCount = computed(() => this.quizResult()?.totalCount ?? this.reviewedQuestions().length);

  readonly isKidsLayout = computed(() => this.isKidsAgeGroup(this.ageGroup()));

  readonly hasResultData = computed(() => this.reviewedQuestions().length > 0);

  private getQuizResultFromState(): QuizAttemptResult | null {
    const state = window.history.state as { quizResult?: QuizAttemptResult } | null;
    return state?.quizResult ?? null;
  }

  private isKidsAgeGroup(ageGroup: QuizAgeGroup | null): boolean {
    return ageGroup === '7-9' || ageGroup === '10-12';
  }

  playAgain(): void {
    if (!this.ageGroup()) {
      return;
    }

    this.router.navigate(['/quiz', this.ageGroup()]);
  }

  openLeaderboard(): void {
    this.router.navigate(['/leaderboard'], {
      state: {
        ageGroup: this.ageGroup(),
        quizResult: this.quizResult()
      }
    });
  }

  getStatusClass(item: QuizQuestionReview): string {
    if (item.isCorrect) {
      return 'bg-emerald-100 text-emerald-700';
    }

    return this.isKidsLayout() ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700';
  }

  getStatusBubbleClass(item: QuizQuestionReview): string {
    if (item.isCorrect) {
      return 'bg-emerald-600 text-white';
    }

    return this.isKidsLayout() ? 'bg-orange-500 text-white' : 'bg-rose-600 text-white';
  }

  getStatusIcon(item: QuizQuestionReview): string {
    if (item.isCorrect) {
      return 'pi pi-check';
    }

    return this.isKidsLayout() ? 'pi pi-circle' : 'pi pi-times';
  }

  readonly resultTitle = computed(() => {
    const total = this.totalCount();

    if (total === 0) {
      return 'Quiz Complete';
    }

    const percentage = (this.correctCount() / total) * 100;

    if (percentage === 100) return 'Perfect Score! 🎉';
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 75) return 'Great Job!';
    if (percentage >= 60) return 'Well Done!';
    if (percentage >= 40) return 'Keep Practicing!';
    return "Don't Give Up!";
  });

  readonly resultSubtitle = computed(() => {
    const total = this.totalCount();

    if (total === 0) {
      return '';
    }

    const percentage = (this.correctCount() / total) * 100;

    if (percentage === 100) return 'You answered every question correctly.';
    if (percentage >= 90) return 'You have an excellent understanding.';
    if (percentage >= 75) return "You're doing really well.";
    if (percentage >= 60) return "A little more practice and you'll improve even more.";
    if (percentage >= 40) return 'Review the questions you missed and try again.';
    return 'Retry the missed questions and keep learning!';
  });

}