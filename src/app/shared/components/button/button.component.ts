import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './button.component.html'
})
export class ButtonComponent {

  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() disabled = false;

  @Input() loading = false;

  @Input() fullWidth = false;

  @Input() variant: ButtonVariant = 'primary';

  @Input() size: ButtonSize = 'md';

  @Input() styleClass = '';

  @Output() buttonClick = new EventEmitter<void>();

  private readonly variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    outline: 'border border-brand-600 bg-white text-brand-600 hover:bg-brand-50',
    ghost: 'text-brand-600 hover:bg-brand-50',
  };

  private readonly sizeClasses: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-sm rounded-button',
    md: 'h-10 px-4 text-sm rounded-button',
    lg: 'h-11 px-5 text-sm rounded-button',
  };

  get computedClasses(): string {
    return [
      'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.variantClasses[this.variant],
      this.sizeClasses[this.size],
      this.fullWidth ? 'w-full' : '',
      this.styleClass,
    ].filter(Boolean).join(' ');
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }

}
