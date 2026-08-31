import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);

  readonly currentUser = this.auth.getUser();

  logout(): void {
    this.auth.clearToken();
    window.location.href = '/login';
  }
}
