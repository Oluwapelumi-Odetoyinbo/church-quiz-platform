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
        size="lg"
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