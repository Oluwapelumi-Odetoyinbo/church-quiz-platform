import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import type { CategoryDto } from '../../core/models/api';
import { CatalogService } from '../../core/services/catalog.service';
import { StudentApiService } from '../../core/services/student-api.service';
import { StudentSessionService } from '../../core/services/student-session.service';
import { getHttpErrorMessage } from '../../core/interceptors/error.interceptor';
import { CardComponent } from '../../shared/components/card/card.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { StepProgressComponent } from '../../shared/components/step-progress/step-progress.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ButtonComponent,
    StepProgressComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './category.component.html'
})
export class CategoryPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  private readonly studentApi = inject(StudentApiService);
  private readonly session = inject(StudentSessionService);

  ageGroupId = '';
  ageGroupName = '';
  categories: CategoryDto[] = [];
  selectedIndex = 0;
  loading = true;
  starting = false;
  error = '';

  ngOnInit(): void {
    if (!this.session.hasProfile()) {
      void this.router.navigate(['/']);
      return;
    }

    this.ageGroupId = this.route.snapshot.paramMap.get('ageGroupId') ?? '';
    const catalog = this.session.getCatalogSelection();

    if (!this.ageGroupId || (catalog && catalog.ageGroupId !== this.ageGroupId)) {
      if (!this.ageGroupId) {
        void this.router.navigate(['/age-group']);
        return;
      }
    }

    this.ageGroupName = catalog?.ageGroupName ?? '';

    this.catalog.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;

        this.studentApi.getProgress().subscribe({
          next: (progress) => {
            this.session.setAvailableSubjects(progress.availableCategoryIds ?? categories.map((category) => category.id));
            this.session.setCompletedSubjects(progress.completedCategoryIds ?? []);
            this.loading = false;

            const savedId = catalog?.categoryId;
            if (savedId) {
              const idx = categories.findIndex((c) => c.id === savedId);
              if (idx >= 0) {
                this.selectedIndex = idx;
              }
            }
          },
          error: () => {
            this.session.setAvailableSubjects(categories.map((category) => category.id));
            this.session.setCompletedSubjects([]);
            this.loading = false;

            const savedId = catalog?.categoryId;
            if (savedId) {
              const idx = categories.findIndex((c) => c.id === savedId);
              if (idx >= 0) {
                this.selectedIndex = idx;
              }
            }
          }
        });
      },
      error: (err) => {
        this.error = getHttpErrorMessage(err);
        this.loading = false;
      }
    });
  }

  isCategoryLocked(categoryId: string): boolean {
    return this.session.isSubjectCompleted(categoryId);
  }

  selectCategory(index: number): void {
    const category = this.categories[index];
    if (!category || this.isCategoryLocked(category.id)) {
      return;
    }

    this.selectedIndex = index;
  }

  startQuiz(): void {
    const profile = this.session.getProfile();
    const category = this.categories[this.selectedIndex];

    if (!profile || !category || !this.ageGroupId || this.starting) {
      return;
    }

    if (this.isCategoryLocked(category.id)) {
      this.error = 'This subject has already been completed for this cycle.';
      return;
    }

    this.starting = true;
    this.error = '';

    this.session.setCatalogSelection({
      ageGroupId: this.ageGroupId,
      ageGroupName: this.ageGroupName,
      categoryId: category.id,
      categoryName: category.name
    });

    const body = {
      ageGroupId: this.ageGroupId,
      categoryId: category.id,
      ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
      ...(profile.classCode ? { classCode: profile.classCode } : {})
    };

    this.studentApi.start(body).subscribe({
      next: (res) => {
        this.session.setSession({
          sessionToken: res.sessionToken,
          studentId: res.studentId,
          attemptId: res.attemptId,
          expiresAt: res.expiresAt,
          timeLimitSeconds: res.timeLimitSeconds
        });
        this.starting = false;
        void this.router.navigate(['/quiz', res.attemptId]);
      },
      error: (err: HttpErrorResponse) => {
        this.error = getHttpErrorMessage(err);
        this.starting = false;
      }
    });
  }

  goBack(): void {
    void this.router.navigate(['/age-group']);
  }
}
