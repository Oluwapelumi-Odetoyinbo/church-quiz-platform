import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-quiz-footer',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="flex items-center justify-end gap-3">
      <app-button
        [disabled]="disabled"
        styleClass="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
        (buttonClick)="next.emit()">
        Next
        <i class="pi pi-arrow-right"></i>
      </app-button>
    </div>
  `
})
export class QuizFooterComponent {
  @Input() disabled = false;

  @Output() next = new EventEmitter<void>();
}