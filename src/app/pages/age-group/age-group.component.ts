import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import type { AgeGroupDto } from '../../core/models/api';
import { CatalogService } from '../../core/services/catalog.service';
import { StudentSessionService } from '../../core/services/student-session.service';
import { getHttpErrorMessage } from '../../core/interceptors/error.interceptor';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { StepProgressComponent } from '../../shared/components/step-progress/step-progress.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

const AGE_ICONS: Record<string, { icon: string; label: string }> = {
  '7-9': { icon: '🎈', label: 'KIDS' },
  '10-12': { icon: '⚽', label: 'PRETEENS' },
  '13-15': { icon: '🎮', label: 'TEENS' },
  '16-18': { icon: '☀️', label: 'YOUTH' }
};

@Component({
  selector: 'app-age-group-page',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    StepProgressComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: 'age-group.component.html'
})
export class AgeGroupPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  private readonly session = inject(StudentSessionService);

  selectedIndex = 0;
  ageGroups: AgeGroupDto[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    if (!this.session.hasProfile()) {
      void this.router.navigate(['/']);
      return;
    }

    this.catalog.getAgeGroups().subscribe({
      next: (groups) => {
        this.ageGroups = groups;
        this.loading = false;

        const savedId = this.session.getCatalogSelection()?.ageGroupId;
        if (savedId) {
          const idx = groups.findIndex((g) => g.id === savedId);
          if (idx >= 0) {
            this.selectedIndex = idx;
          }
        }
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  getIcon(group: AgeGroupDto): string {
    const key = `${group.minAge}-${group.maxAge}`;
    return AGE_ICONS[key]?.icon ?? '📖';
  }

  getLabel(group: AgeGroupDto): string {
    const key = `${group.minAge}-${group.maxAge}`;
    return AGE_ICONS[key]?.label ?? 'GROUP';
  }

  selectAge(index: number): void {
    this.selectedIndex = index;
  }

  continue(): void {
    const group = this.ageGroups[this.selectedIndex];
    if (!group) {
      return;
    }

    this.session.setCatalogSelection({
      ageGroupId: group.id,
      ageGroupName: group.name
    });

    void this.router.navigate(['/category', group.id]);
  }

  goBack(): void {
    void this.router.navigate(['/']);
  }
}
