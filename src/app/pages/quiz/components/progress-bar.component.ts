import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [],
  template: `
    <div class="space-y-2">
      <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
        <span>Progress</span>
        <span>{{ current }} / {{ total }}</span>
      </div>

      <div class="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          class="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all"
          [style.width.%]="progressPercent">
        </div>
      </div>
    </div>
  `
})
export class ProgressBarComponent {
  @Input() current = 1;

  @Input() total = 1;

  get progressPercent(): number {
    if (!this.total) {
      return 0;
    }

    return Math.min(100, Math.max(0, (this.current / this.total) * 100));
  }
}