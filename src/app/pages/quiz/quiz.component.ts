import { NgClass } from '@angular/common';
import {
  Component,
  DestroyRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import type { QuizQuestionDto, SubmitQuizResponse } from '../../core/models/api';
import { QuizApiService } from '../../core/services/quiz-api.service';
import { AntiCheatService } from '../../core/services/anti-cheat.service';
import { StudentSessionService } from '../../core/services/student-session.service';
import { getHttpErrorMessage } from '../../core/interceptors/error.interceptor';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [ButtonComponent, AppLogoComponent, NgClass, LoadingSpinnerComponent],
  templateUrl: './quiz.component.html'
})
export class QuizPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizApi = inject(QuizApiService);
  private readonly antiCheat = inject(AntiCheatService);
  private readonly session = inject(StudentSessionService);
  private readonly destroyRef = inject(DestroyRef);

  private timerIntervalId: ReturnType<typeof setInterval> | null = null;
  private advancing = false;
  private quizFinished = false;
  private tabSwitchHandling = false;

  readonly attemptId = signal(this.route.snapshot.paramMap.get('attemptId') ?? '');
  readonly questions = signal<QuizQuestionDto[]>([]);
  readonly currentIndex = signal(0);
  readonly selectedChoiceId = signal<string | null>(null);
  readonly timerSeconds = signal(30);
  readonly timeLimitSeconds = signal(30);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly antiCheatWarning = signal('');
  readonly catalog = this.session.getCatalogSelection();

  readonly timerLabel = computed(() => this.formatTime(this.timerSeconds()));

  readonly timerClass = computed(() => {
    const seconds = this.timerSeconds();
    if (seconds <= 5) return 'timer-critical border';
    if (seconds <= 10) return 'timer-warning border';
    return 'border-slate-200 bg-white text-slate-700';
  });

  readonly currentQuestion = computed(() => this.questions()[this.currentIndex()] ?? null);

  readonly totalQuestions = computed(() => this.questions().length);

  readonly isLastQuestion = computed(() => {
    const total = this.totalQuestions();
    return total > 0 && this.currentIndex() === total - 1;
  });

  readonly difficultyChipClass = computed(() => {
    const difficulty = this.currentQuestion()?.difficulty;
    switch (difficulty) {
      case 'easy':
        return 'bg-violet-50 text-violet-700';
      case 'medium':
        return 'bg-amber-50 text-amber-700';
      case 'hard':
        return 'bg-orange-50 text-orange-700';
      default:
        return '';
    }
  });

  ngOnInit(): void {
    const attemptId = this.attemptId();
    const sessionAttempt = this.session.getAttemptId();

    if (!attemptId || attemptId !== sessionAttempt) {
      void this.router.navigate(['/']);
      return;
    }

    this.timeLimitSeconds.set(this.session.getTimeLimitSeconds());
    this.loadQuiz(attemptId);
  }

  ngOnDestroy(): void {
    this.clearQuestionTimer();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.visibilityState === 'hidden') {
      this.handleTabSwitch();
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.quizFinished) {
      return;
    }

    const attemptId = this.attemptId();
    if (attemptId) {
      this.antiCheat.beaconPageUnload(attemptId);
    }

    event.preventDefault();
    event.returnValue = '';
  }

  selectChoice(choiceId: string): void {
    if (this.saving() || this.advancing) {
      return;
    }

    this.selectedChoiceId.set(choiceId);
  }

  nextQuestion(): void {
    void this.advance(false);
  }

  private loadQuiz(attemptId: string): void {
    this.loading.set(true);
    this.error.set('');

    this.quizApi.getQuiz(attemptId).subscribe({
      next: (quiz) => {
        const sorted = [...quiz.questions].sort((a, b) => a.slotNumber - b.slotNumber);
        this.questions.set(sorted);
        this.timeLimitSeconds.set(quiz.timeLimitSeconds || this.session.getTimeLimitSeconds());
        this.loading.set(false);

        if (sorted.length) {
          this.startQuestionTimer();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(getHttpErrorMessage(err));
        this.loading.set(false);
      }
    });
  }

  private async advance(_fromTimeout: boolean): Promise<void> {
    if (this.advancing || this.quizFinished || this.saving()) {
      return;
    }

    const question = this.currentQuestion();
    const attemptId = this.attemptId();

    if (!question || !attemptId) {
      return;
    }

    this.advancing = true;
    this.clearQuestionTimer();
    this.saving.set(true);

    const selectedChoiceId = this.selectedChoiceId();

    try {
      // Save when the child picked an answer; skip on timeout with no selection.
      if (selectedChoiceId) {
        await this.saveAnswer({
          attemptId,
          questionId: question.questionId,
          selectedChoiceId
        });
      }

      if (this.isLastQuestion()) {
        await this.submitQuiz(attemptId);
        return;
      }

      this.currentIndex.update((i) => i + 1);
      this.selectedChoiceId.set(null);
      this.startQuestionTimer();
    } catch (err) {
      this.error.set(getHttpErrorMessage(err as HttpErrorResponse));
    } finally {
      this.saving.set(false);
      this.advancing = false;
    }
  }

  private saveAnswer(body: {
    attemptId: string;
    questionId: string;
    selectedChoiceId?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      this.quizApi.saveAnswer(body).subscribe({
        next: () => resolve(),
        error: (err) => reject(err)
      });
    });
  }

  private submitQuiz(attemptId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.quizApi.submit(attemptId).subscribe({
        next: (result) => {
          this.finishWithResult(result);
          resolve();
        },
        error: (err) => reject(err)
      });
    });
  }

  private finishWithResult(result: SubmitQuizResponse): void {
    this.quizFinished = true;
    this.clearQuestionTimer();
    this.session.setResult(result);
    void this.router.navigate(['/results', result.attemptId]);
  }

  private handleTabSwitch(): void {
    if (this.quizFinished || this.tabSwitchHandling || this.loading()) {
      return;
    }

    const attemptId = this.attemptId();
    if (!attemptId) {
      return;
    }

    this.tabSwitchHandling = true;

    this.antiCheat
      .reportTabSwitch(attemptId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.tabSwitchHandling = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res.action === 'warn') {
            this.antiCheatWarning.set(res.message || 'Stay on this page — switching tabs may end your quiz.');
            return;
          }

          if (res.action === 'auto_submit') {
            this.finishWithResult(res.result);
          }
        },
        error: () => {
          // Non-blocking — don't interrupt quiz on anti-cheat network errors
        }
      });
  }

  private startQuestionTimer(): void {
    this.clearQuestionTimer();
    this.timerSeconds.set(this.timeLimitSeconds());

    this.timerIntervalId = setInterval(() => {
      const remaining = this.timerSeconds() - 1;

      if (remaining <= 0) {
        this.timerSeconds.set(0);
        void this.advance(true);
        return;
      }

      this.timerSeconds.set(remaining);
    }, 1000);
  }

  private clearQuestionTimer(): void {
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  private formatTime(secondsRemaining: number): string {
    const minutes = Math.floor(secondsRemaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.max(0, secondsRemaining % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }
}
