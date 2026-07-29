import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { AgeGroupDto, CategoryDto } from '../models/api';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly api = inject(ApiService);

  getAgeGroups(): Observable<AgeGroupDto[]> {
    return this.api.get<AgeGroupDto[]>('/catalog/age-groups');
  }

  getCategories(): Observable<CategoryDto[]> {
    return this.api.get<CategoryDto[]>('/catalog/categories');
  }
}
