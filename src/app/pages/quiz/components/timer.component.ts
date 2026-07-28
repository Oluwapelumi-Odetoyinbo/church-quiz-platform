import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [],
  template: `
    <div class="inline-flex items-center gap-3 rounded-full bg-slate-900 px-4 py-2 text-white shadow-sm">
      <span class="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">Timer</span>
      <span class="text-sm font-semibold tabular-nums">{{ formattedTime }}</span>
    </div>
  `
})
export class TimerComponent {
  @Input() secondsRemaining = 0;

  get formattedTime(): string {
    const minutes = Math.floor(this.secondsRemaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.max(0, this.secondsRemaining % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${seconds}`;
  }
}