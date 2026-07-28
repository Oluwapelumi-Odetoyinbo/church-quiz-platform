import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-progress',
  standalone: true,
  template: `
    <div>
      <div class="flex items-center justify-between gap-3">
        <p class="step-label">Step {{ current }} of {{ total }}</p>
        <p class="text-xs text-slate-400">{{ progressPercent }}%</p>
      </div>
      <div class="step-bar mt-2">
        <div
          class="step-bar-fill transition-all duration-500 ease-out"
          [style.width.%]="progressPercent">
        </div>
      </div>
    </div>
  `
})
export class StepProgressComponent {
  @Input({ required: true }) current = 1;

  @Input({ required: true }) total = 3;

  get progressPercent(): number {
    if (this.total <= 0) {
      return 0;
    }

    return Math.round((this.current / this.total) * 100);
  }
}
