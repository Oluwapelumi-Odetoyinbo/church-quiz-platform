import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-score-ring',
  standalone: true,
  template: `
    <div class="relative inline-flex items-center justify-center" [style.width.px]="size" [style.height.px]="size">
      <svg class="-rotate-90" [attr.width]="size" [attr.height]="size" [attr.viewBox]="'0 0 ' + size + ' ' + size">
        <circle
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          stroke="#E2E8F0"
          [attr.stroke-width]="stroke" />
        <circle
          [attr.cx]="center"
          [attr.cy]="center"
          [attr.r]="radius"
          fill="none"
          stroke="#6D47C4"
          [attr.stroke-width]="stroke"
          stroke-linecap="round"
          [attr.stroke-dasharray]="circumference"
          [attr.stroke-dashoffset]="dashOffset"
          class="transition-all duration-700 ease-out" />
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="font-semibold tabular-nums text-brand-900" [class]="scoreClass">{{ correct }}/{{ total }}</span>
        @if (showPercent) {
          <span class="text-xs text-slate-400">{{ percent }}%</span>
        }
      </div>
    </div>
  `
})
export class ScoreRingComponent {
  @Input() correct = 0;

  @Input() total = 0;

  @Input() size = 112;

  @Input() stroke = 6;

  @Input() showPercent = true;

  get center(): number {
    return this.size / 2;
  }

  get radius(): number {
    return (this.size - this.stroke) / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get percent(): number {
    if (this.total <= 0) {
      return 0;
    }

    return Math.round((this.correct / this.total) * 100);
  }

  get dashOffset(): number {
    return this.circumference * (1 - this.percent / 100);
  }

  get scoreClass(): string {
    return this.size >= 112 ? 'text-2xl' : 'text-lg';
  }
}
