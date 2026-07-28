import { Component, Input } from '@angular/core';

import { QuizAgeGroup } from '../../../core/models/quiz-question.model';

@Component({
  selector: 'app-question-header',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-500">Quiz engine</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-900">Bible Quiz</h1>
        @if (ageGroup) {
          <p class="mt-2 text-sm text-slate-500">Age group {{ ageGroup }}</p>
        } @else {
          <p class="mt-2 text-sm text-slate-500">Age group not selected</p>
        }
      </div>

      <div class="rounded-3xl bg-slate-100 px-4 py-3 text-right">
        <p class="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Question</p>
        <p class="mt-1 text-lg font-semibold text-slate-900">{{ questionNumber }} / {{ totalQuestions }}</p>
      </div>
    </div>
  `
})
export class QuestionHeaderComponent {
  @Input() ageGroup: QuizAgeGroup | null = null;

  @Input() questionNumber = 1;

  @Input() totalQuestions = 0;
}