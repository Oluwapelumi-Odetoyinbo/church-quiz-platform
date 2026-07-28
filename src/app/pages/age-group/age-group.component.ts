


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { StepProgressComponent } from '../../shared/components/step-progress/step-progress.component';

@Component({
  selector: 'app-age-group-page',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    StepProgressComponent
  ],
  templateUrl: 'age-group.component.html'
})
export class AgeGroupPageComponent {

  selectedAge = 1;

  ageGroups = [
    {
      icon: '🎈',
      age: '7-9',
      label: 'KIDS'
    },
    {
      icon: '⚽',
      age: '10-12',
      label: 'PRETEENS'
    },
    {
      icon: '🎮',
      age: '13-15',
      label: 'TEENS'
    },
    {
      icon: '☀️',
      age: '16-18',
      label: 'YOUTH'
    }
  ];

  constructor(private router: Router) {}

  selectAge(index: number) {
    this.selectedAge = index;
  }

  continue() {
    const age = this.ageGroups[this.selectedAge].age;

    this.router.navigate(['/instructions', age]);
  }

  goBack() {
    this.router.navigate(['/landing']);
  }

}