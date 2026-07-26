import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="bg-white rounded-xl shadow-md p-8 text-center">
        <i class="pi pi-cog text-gray-600 text-4xl mb-4"></i>
        <h1 class="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p class="text-gray-500 mt-2">Admin management tools will be built here.</p>
      </div>
    </div>
  `
})
export class AdminComponent {}
