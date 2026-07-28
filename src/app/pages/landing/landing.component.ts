import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';
import { StepProgressComponent } from '../../shared/components/step-progress/step-progress.component';

@Component({
  selector: 'app-details',
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

  constructor(private router: Router) {}

  name = '';

  nameTouched = false;

  classCode = '';

  selectedAvatar = 2;

  avatars = [
    {
      emoji: '🦁',
      bg: 'bg-[#FFF3D7]'
    },
    {
      emoji: '🐬',
      bg: 'bg-[#DDF4FF]'
    },
    {
      emoji: '🦊',
      bg: 'bg-[#FFE7D6]'
    },
    {
      emoji: '🐸',
      bg: 'bg-[#DDFBEA]'
    },
    {
      emoji: '🦋',
      bg: 'bg-[#F3E7FF]'
    },
    {
      emoji: '🐧',
      bg: 'bg-[#DDF4FF]'
    }
  ];

  selectAvatar(index: number) {
    this.selectedAvatar = index;
  }

  get canContinue(): boolean {
    return this.name.trim().length > 0;
  }

  continue() {
    if (!this.canContinue) {
      return;
    }

    this.router.navigate(['/age-group']);
  }

}