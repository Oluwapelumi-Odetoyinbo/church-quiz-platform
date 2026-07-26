import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-card" [class]="styleClass">
      <div class="app-card-header" *ngIf="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="app-card-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .app-card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .app-card-header {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .app-card-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }
    .app-card-body {
      padding: 1.25rem;
    }
  `]
})
export class CardComponent {
  @Input() title = '';
  @Input() styleClass = '';
}
