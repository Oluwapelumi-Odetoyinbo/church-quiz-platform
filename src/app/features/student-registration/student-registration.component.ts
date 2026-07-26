import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-registration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="bg-white rounded-xl shadow-md p-8 text-center">
        <i class="pi pi-user-plus text-indigo-500 text-4xl mb-4"></i>
        <h1 class="text-2xl font-bold text-gray-800">Student Registration</h1>
        <p class="text-gray-500 mt-2">Registration form will be built here.</p>
      </div>
    </div>
  `
})
export class StudentRegistrationComponent {}
