import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardComponent, ButtonComponent, AppLogoComponent],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  loading = false;
  checkingUsername = false;
  usernameStatus: 'idle' | 'available' | 'taken' | 'invalid' = 'idle';
  usernameMessage = '';
  error = '';

  readonly form: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: this.passwordsMatchValidator }
  );

  constructor() {
    if (this.auth.isLoggedIn()) {
      void this.router.navigate(['/dashboard']);
    }

    this.form.get('username')?.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        const username = (value ?? '').trim();

        if (!username || username.length < 3) {
          this.usernameStatus = 'invalid';
          this.usernameMessage = username.length > 0 ? 'Username must be at least 3 characters long.' : '';
          return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          this.usernameStatus = 'invalid';
          this.usernameMessage = 'Username may only contain letters, numbers, and underscores.';
          return;
        }

        this.checkingUsername = true;
        this.usernameStatus = 'idle';
        this.usernameMessage = 'Checking username...';

        this.auth.checkUsernameAvailability(username).subscribe({
          next: (available) => {
            this.checkingUsername = false;
            this.usernameStatus = available ? 'available' : 'taken';
            this.usernameMessage = available ? 'Username is available.' : 'Username is already taken.';
          },
          error: () => {
            this.checkingUsername = false;
            this.usernameStatus = 'taken';
            this.usernameMessage = 'Username is already taken.';
          }
        });
      });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.loading) {
      if (this.form.hasError('passwordMismatch')) {
        this.error = 'Passwords do not match.';
      } else {
        this.error = 'Please fix the highlighted fields and try again.';
      }
      return;
    }

    if (this.usernameStatus === 'taken') {
      this.error = 'This username is already taken. Please choose another one.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.signupUser({
      email: this.form.value.email.trim(),
      username: this.form.value.username.trim(),
      password: this.form.value.password
    }).subscribe({
      next: (session) => {
        this.auth.storeSession(session);
        this.loading = false;
        void this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'We could not create your account right now. Please try again.';
        this.loading = false;
      }
    });
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value ?? '';
    const confirmPassword = group.get('confirmPassword')?.value ?? '';

    return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
  }
}
