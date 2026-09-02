import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CardComponent, ButtonComponent, AppLogoComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = '';

  constructor() {
    if (this.auth.isLoggedIn()) {
      void this.router.navigate(['/age-group']);
    }
  }

  readonly form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      this.error = 'Please enter a valid username and password.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.auth.loginUser({
      username: this.form.value.username.trim(),
      password: this.form.value.password
    }).subscribe({
      next: (session) => {
        this.auth.storeSession(session);
        this.loading = false;
        void this.router.navigate(['/age-group']);
      },
      error: () => {
        this.error = 'Invalid username or password. Please try again.';
        this.loading = false;
      }
    });
  }
}
