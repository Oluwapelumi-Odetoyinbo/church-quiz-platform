import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

import { CardComponent } from '../../shared/components/card/card.component';
import { AppLogoComponent } from '../../shared/components/app-logo/app-logo.component';

interface LeaderboardPlayer {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  me?: boolean;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, CardComponent, AppLogoComponent],
  templateUrl: './leaderboard.component.html'
})
export class LeaderboardComponent {
  selectedTab = 'class';

  leaderboard: LeaderboardPlayer[] = [
    {
      rank: 1,
      name: 'Lucas',
      avatar: '🦁',
      points: 98
    },
    {
      rank: 2,
      name: 'Amara',
      avatar: '🐬',
      points: 94
    },
    {
      rank: 3,
      name: 'Noah',
      avatar: '🦊',
      points: 91
    },
    {
      rank: 4,
      name: 'Emma',
      avatar: '🐸',
      points: 85,
      me: true
    },
    {
      rank: 5,
      name: 'Liam',
      avatar: '🦋',
      points: 80
    },
    {
      rank: 6,
      name: 'Sofia',
      avatar: '🐧',
      points: 76
    },
    {
      rank: 7,
      name: 'Ethan',
      avatar: '🦁',
      points: 72
    }
  ];

  constructor(private router: Router) {}

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  back(): void {
    const state = window.history.state as { ageGroup?: string } | null;
    const ageGroup = state?.ageGroup;

    if (ageGroup) {
      this.router.navigate(['/results', ageGroup], { state });
      return;
    }

    this.router.navigate(['/results/7-9']);
  }
}