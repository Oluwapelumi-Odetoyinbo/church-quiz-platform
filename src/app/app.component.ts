import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Navigation Bar -->
    <nav class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 text-xl font-bold text-indigo-600 no-underline">
            <i class="pi pi-book"></i>
            Church Quiz
          </a>

          <!-- Nav Links -->
          <div class="hidden md:flex items-center gap-1">
            <a routerLink="/"
               routerLinkActive="bg-indigo-50 text-indigo-600"
               [routerLinkActiveOptions]="{ exact: true }"
               class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors no-underline">
              Home
            </a>
            <a routerLink="/register"
               routerLinkActive="bg-indigo-50 text-indigo-600"
               class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors no-underline">
              Register
            </a>
            <a routerLink="/categories"
               routerLinkActive="bg-indigo-50 text-indigo-600"
               class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors no-underline">
              Categories
            </a>
            <a routerLink="/quiz"
               routerLinkActive="bg-indigo-50 text-indigo-600"
               class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors no-underline">
              Quiz
            </a>
            <a routerLink="/result"
               routerLinkActive="bg-indigo-50 text-indigo-600"
               class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors no-underline">
              Results
            </a>
            <a routerLink="/leaderboard"
               routerLinkActive="bg-indigo-50 text-indigo-600"
               class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors no-underline">
              Leaderboard
            </a>
            <a routerLink="/admin"
               routerLinkActive="bg-indigo-50 text-indigo-600"
               class="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors no-underline">
              Admin
            </a>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            (click)="mobileMenuOpen = !mobileMenuOpen">
            <i class="pi" [ngClass]="mobileMenuOpen ? 'pi-times' : 'pi-bars'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="mobileMenuOpen" class="md:hidden border-t border-gray-200 bg-white">
        <div class="px-4 py-3 space-y-1">
          <a routerLink="/" (click)="mobileMenuOpen = false"
             routerLinkActive="bg-indigo-50 text-indigo-600"
             [routerLinkActiveOptions]="{ exact: true }"
             class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 no-underline">
            Home
          </a>
          <a routerLink="/register" (click)="mobileMenuOpen = false"
             routerLinkActive="bg-indigo-50 text-indigo-600"
             class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 no-underline">
            Register
          </a>
          <a routerLink="/categories" (click)="mobileMenuOpen = false"
             routerLinkActive="bg-indigo-50 text-indigo-600"
             class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 no-underline">
            Categories
          </a>
          <a routerLink="/quiz" (click)="mobileMenuOpen = false"
             routerLinkActive="bg-indigo-50 text-indigo-600"
             class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 no-underline">
            Quiz
          </a>
          <a routerLink="/result" (click)="mobileMenuOpen = false"
             routerLinkActive="bg-indigo-50 text-indigo-600"
             class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 no-underline">
            Results
          </a>
          <a routerLink="/leaderboard" (click)="mobileMenuOpen = false"
             routerLinkActive="bg-indigo-50 text-indigo-600"
             class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 no-underline">
            Leaderboard
          </a>
          <a routerLink="/admin" (click)="mobileMenuOpen = false"
             routerLinkActive="bg-indigo-50 text-indigo-600"
             class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 no-underline">
            Admin
          </a>
        </div>
      </div>
    </nav>

    <!-- Router Outlet -->
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  mobileMenuOpen = false;
}
