import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import type { QuizAgeGroup, QuizQuestion } from '../../core/models/quiz-question.model';
import type { QuizAttemptResult, QuizQuestionReview } from '../../core/models/quiz-result.model';
import { QuizService } from './quiz.service';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [],
  templateUrl: './quiz.component.html'
})
export class QuizPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly quizService = inject(QuizService);

  readonly ageGroup = signal<QuizAgeGroup | null>(this.route.snapshot.paramMap.get('ageGroup') as QuizAgeGroup | null);

  readonly questions = signal<QuizQuestion[]>(this.getInitialQuestions());

  readonly currentIndex = signal(0);

  readonly answer = signal('');

  readonly timerSeconds = signal(60);

  readonly reviewedQuestions = signal<QuizQuestionReview[]>([]);

  readonly timerLabel = computed(() => this.formatTime(this.timerSeconds()));

  readonly currentQuestion = computed<QuizQuestion | null>(() => {
    return this.questions()[this.currentIndex()] ?? null;
  });

  readonly totalQuestions = computed(() => this.questions().length);

  readonly isLastQuestion = computed(() => {
    const totalQuestions = this.totalQuestions();
    return totalQuestions > 0 && this.currentIndex() === totalQuestions - 1;
  });

  constructor() {
    effect(() => {
      this.currentIndex.set(0);
      this.answer.set('');
    });
  }

  private getInitialQuestions(): QuizQuestion[] {
    return this.quizService.getQuestionsForAgeGroup(this.ageGroup());
  }

  updateAnswer(value: string): void {
    this.answer.set(value);
  }

  updateAnswerFromEvent(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.answer.set(target?.value ?? '');
  }

  handleKeyPress(key: string): void {
    if (key === 'C') {
      this.answer.set('');
      return;
    }

    if (key === '⌫') {
      this.answer.update((currentAnswer) => currentAnswer.slice(0, -1));
      return;
    }

    this.answer.update((currentAnswer) => `${currentAnswer}${key}`);
  }

  nextQuestion(): void {
    const ageGroup = this.ageGroup();
    const currentQuestion = this.currentQuestion();
    const totalQuestions = this.totalQuestions();

    if (!totalQuestions || !ageGroup || !currentQuestion) {
      return;
    }

    const reviewedQuestion = this.buildReview(currentQuestion, this.answer());
    const nextReviewedQuestions = [...this.reviewedQuestions(), reviewedQuestion];
    this.reviewedQuestions.set(nextReviewedQuestions);

    if (!this.isLastQuestion()) {
      this.currentIndex.update((currentIndex) => currentIndex + 1);
      this.answer.set('');
      return;
    }

    const result: QuizAttemptResult = {
      ageGroup,
      reviewedQuestions: nextReviewedQuestions,
      correctCount: nextReviewedQuestions.filter((item) => item.isCorrect).length,
      totalCount: nextReviewedQuestions.length
    };

    this.router.navigate(['/results', ageGroup], { state: { quizResult: result } });
  }

  private buildReview(question: QuizQuestion, userAnswer: string): QuizQuestionReview {
    return {
      question,
      userAnswer,
      isCorrect: this.isAnswerCorrect(question, userAnswer)
    };
  }

  private isAnswerCorrect(question: QuizQuestion, userAnswer: string): boolean {
    const normalize = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase().trim();
    return normalize(userAnswer) === normalize(question.answer);
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