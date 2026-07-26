import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div class="max-w-4xl mx-auto px-6 py-16">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Church Quiz Platform
          </h1>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your knowledge, grow in faith, and compete with fellow members.
          </p>
        </div>

        <!-- Proof: Tailwind + PrimeNG working together -->
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div class="flex flex-col items-center gap-6">
            <i class="pi pi-check-circle text-green-500 text-5xl"></i>
            <h2 class="text-2xl font-semibold text-gray-800">
              ✅ Tailwind CSS + PrimeNG are working!
            </h2>
            <p class="text-gray-500">
              This page uses Tailwind utility classes for layout and PrimeNG for the button below.
            </p>
            <div class="flex gap-4 flex-wrap justify-center">
              <p-button
                label="Get Started"
                icon="pi pi-arrow-right"
                iconPos="right"
                severity="success"
                [rounded]="true"
                routerLink="/register">
              </p-button>
              <p-button
                label="View Leaderboard"
                icon="pi pi-trophy"
                severity="warning"
                [outlined]="true"
                [rounded]="true"
                routerLink="/leaderboard">
              </p-button>
              <p-button
                label="Admin Dashboard"
                icon="pi pi-cog"
                severity="secondary"
                [rounded]="true"
                [outlined]="true"
                routerLink="/admin">
              </p-button>
            </div>
          </div>
        </div>

        <!-- Feature Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div class="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <i class="pi pi-users text-indigo-500 text-3xl mb-3"></i>
            <h3 class="font-semibold text-gray-800 mb-2">Register</h3>
            <p class="text-sm text-gray-500">Sign up to start taking quizzes</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <i class="pi pi-book text-purple-500 text-3xl mb-3"></i>
            <h3 class="font-semibold text-gray-800 mb-2">Choose Category</h3>
            <p class="text-sm text-gray-500">Pick a topic and test your knowledge</p>
          </div>
          <div class="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <i class="pi pi-trophy text-amber-500 text-3xl mb-3"></i>
            <h3 class="font-semibold text-gray-800 mb-2">Leaderboard</h3>
            <p class="text-sm text-gray-500">See how you rank among members</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
