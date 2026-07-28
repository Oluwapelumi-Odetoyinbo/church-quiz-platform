import { Component, Input } from '@angular/core';

type LogoSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <div
      class="inline-flex items-center justify-center rounded-lg bg-brand-600 shrink-0"
      [class]="sizeClasses[size]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        class="text-white"
        [class]="iconClasses[size]"
        aria-hidden="true">
        <line x1="12" y1="4" x2="12" y2="20"></line>
        <line x1="8" y1="9" x2="16" y2="9"></line>
      </svg>
    </div>
  `
})
export class AppLogoComponent {
  @Input() size: LogoSize = 'md';

  readonly sizeClasses: Record<LogoSize, string> = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  readonly iconClasses: Record<LogoSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
}
