import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AVATAR_OPTIONS } from '../../core/constants/avatars';
import { AuthService } from '../../core/services/auth.service';
import { StudentSessionService } from '../../core/services/student-session.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';
import { StepProgressComponent } from '../../shared/components/step-progress/step-progress.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    AppLogoComponent,
    StepProgressComponent
  ],
  templateUrl: 'landing.component.html'
})
export class LandingPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly session = inject(StudentSessionService);

  name = '';
  nameTouched = false;
  classCode = '';
  selectedAvatar = 2;
  sessionExpired = false;

  readonly avatars = AVATAR_OPTIONS;

  constructor() {
    if (this.auth.isLoggedIn()) {
      void this.router.navigate(['/age-group']);
      return;
    }

    void this.router.navigate(['/signup']);

    this.sessionExpired = this.route.snapshot.queryParamMap.get('sessionExpired') === '1';

    const profile = this.session.getProfile();
    if (profile) {
      this.name = profile.displayName;
      this.classCode = profile.classCode ?? '';
      const idx = this.avatars.findIndex(
        (a) => a.emoji === profile.avatarEmoji || a.url === profile.avatarUrl
      );
      if (idx >= 0) {
        this.selectedAvatar = idx;
      }
    }
  }

  selectAvatar(index: number): void {
    this.selectedAvatar = index;
  }

  get canContinue(): boolean {
    return this.name.trim().length > 0;
  }

  continue(): void {
    if (!this.canContinue) {
      return;
    }

    const displayName = this.name.trim();
    const previousName = this.session.getProfile()?.displayName;

    // New child (different name) must not reuse the previous studentId / no-repeat window.
    if (!previousName || previousName !== displayName) {
      this.session.clearStudentId();
    }

    const avatar = this.avatars[this.selectedAvatar];

    this.session.setProfile({
      displayName,
      avatarUrl: avatar.url,
      avatarEmoji: avatar.emoji,
      classCode: this.classCode.trim() || undefined
    });

    void this.router.navigate(['/age-group']);
  }
}
