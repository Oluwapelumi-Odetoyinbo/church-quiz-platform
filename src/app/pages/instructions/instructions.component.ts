import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { StepProgressComponent } from '../../shared/components/step-progress/step-progress.component';

@Component({
  selector: 'app-instructions-page',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    StepProgressComponent
  ],
  templateUrl: 'instructions.component.html'
})
export class InstructionsPageComponent {

  private readonly route = inject(ActivatedRoute);

  categories = [
    'Mental Health',
    'Bible Basics',
    'Bible Geography'
  ];

  readonly ageGroup = this.route.snapshot.paramMap.get('ageGroup');

  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/age-group']);
  }

  startQuiz() {
    const ageGroup = this.route.snapshot.paramMap.get('ageGroup');

    if (!ageGroup) {
      this.router.navigate(['/age-group']);
      return;
    }

    this.router.navigate(['/quiz', ageGroup]);
  }

}