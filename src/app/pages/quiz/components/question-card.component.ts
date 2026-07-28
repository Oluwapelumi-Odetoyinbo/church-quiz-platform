import { Component, EventEmitter, Input, Output } from '@angular/core';

import { QuizQuestion } from '../../../core/models/quiz-question.model';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [],
  template: `
    @if (question) {
      <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-500">{{ question.subject }}</p>

          <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            Text question
          </span>
        </div>

        <h2 class="mt-4 text-2xl font-semibold leading-snug text-slate-900">
          {{ question.question }}
        </h2>

        <label class="mt-6 block text-sm font-medium text-slate-700" for="quiz-answer">
          Your answer
        </label>

        <input
          id="quiz-answer"
          type="text"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          [value]="answer"
          (input)="emitAnswer($event)"
          class="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" />

        <p class="mt-3 text-xs text-slate-500">Type your answer directly.</p>
      </div>
    }
  `
})
export class QuestionCardComponent {
  @Input() question: QuizQuestion | null = null;

  @Input() answer = '';

  @Output() answerChange = new EventEmitter<string>();

  emitAnswer(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.answerChange.emit(target?.value ?? '');
  }
}