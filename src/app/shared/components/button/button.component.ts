import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="'app-btn ' + styleClass"
      [disabled]="disabled"
      [type]="type">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .app-btn {
      cursor: pointer;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      transition: opacity 0.2s;
    }
    .app-btn:hover {
      opacity: 0.9;
    }
    .app-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ButtonComponent {
  @Input() styleClass = '';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
