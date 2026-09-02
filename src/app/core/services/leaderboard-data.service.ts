import { Injectable } from '@angular/core';

import type { AgeGroupDto, LeaderboardCurrentStudentDto, LeaderboardEntryDto, LeaderboardPeriod } from '../models/api';

export interface LeaderboardFilterState {
  period: LeaderboardPeriod;
  ageGroupId: string | null;
}

interface MockLeaderboardEntry extends LeaderboardEntryDto {
  ageGroupId: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardDataService {
  private readonly mockEntries: MockLeaderboardEntry[] = [
    {
      ageGroupId: '7-9',
      ageGroup: 'Ages 7-9',
      studentId: 'student-001',
      firstName: 'Ava',
      lastName: 'Johnson',
      displayName: 'Ava Johnson',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ava',
      points: 980,
      totalScore: 49,
      maxScore: 50,
      rank: 1,
      isCurrentStudent: false
    },
    {
      ageGroupId: '7-9',
      ageGroup: 'Ages 7-9',
      studentId: 'student-002',
      firstName: 'Milo',
      lastName: 'Brown',
      displayName: 'Milo Brown',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Milo',
      points: 940,
      totalScore: 47,
      maxScore: 50,
      rank: 2,
      isCurrentStudent: false
    },
    {
      ageGroupId: '7-9',
      ageGroup: 'Ages 7-9',
      studentId: 'student-003',
      firstName: 'Sophia',
      lastName: 'Davis',
      displayName: 'Sophia Davis',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia',
      points: 900,
      totalScore: 45,
      maxScore: 50,
      rank: 3,
      isCurrentStudent: false
    },
    {
      ageGroupId: '7-9',
      ageGroup: 'Ages 7-9',
      studentId: 'student-004',
      firstName: 'Noah',
      lastName: 'Wilson',
      displayName: 'Noah Wilson',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Noah',
      points: 820,
      totalScore: 41,
      maxScore: 50,
      rank: 4,
      isCurrentStudent: false
    },
    {
      ageGroupId: '10-12',
      ageGroup: 'Ages 10-12',
      studentId: 'student-101',
      firstName: 'Liam',
      lastName: 'Smith',
      displayName: 'Liam Smith',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Liam',
      points: 1020,
      totalScore: 51,
      maxScore: 52,
      rank: 1,
      isCurrentStudent: false
    },
    {
      ageGroupId: '10-12',
      ageGroup: 'Ages 10-12',
      studentId: 'student-102',
      firstName: 'Emma',
      lastName: 'Taylor',
      displayName: 'Emma Taylor',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Emma',
      points: 990,
      totalScore: 50,
      maxScore: 52,
      rank: 2,
      isCurrentStudent: false
    },
    {
      ageGroupId: '10-12',
      ageGroup: 'Ages 10-12',
      studentId: 'student-103',
      firstName: 'Oliver',
      lastName: 'Anderson',
      displayName: 'Oliver Anderson',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver',
      points: 960,
      totalScore: 48,
      maxScore: 52,
      rank: 3,
      isCurrentStudent: false
    },
    {
      ageGroupId: '13-15',
      ageGroup: 'Ages 13-15',
      studentId: 'student-201',
      firstName: 'Harper',
      lastName: 'Thomas',
      displayName: 'Harper Thomas',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Harper',
      points: 1100,
      totalScore: 55,
      maxScore: 58,
      rank: 1,
      isCurrentStudent: false
    },
    {
      ageGroupId: '13-15',
      ageGroup: 'Ages 13-15',
      studentId: 'student-202',
      firstName: 'Ethan',
      lastName: 'Jackson',
      displayName: 'Ethan Jackson',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ethan',
      points: 1060,
      totalScore: 53,
      maxScore: 58,
      rank: 2,
      isCurrentStudent: false
    },
    {
      ageGroupId: '13-15',
      ageGroup: 'Ages 13-15',
      studentId: 'student-203',
      firstName: 'Isla',
      lastName: 'White',
      displayName: 'Isla White',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Isla',
      points: 1015,
      totalScore: 51,
      maxScore: 58,
      rank: 3,
      isCurrentStudent: false
    },
    {
      ageGroupId: '16-18',
      ageGroup: 'Ages 16-18',
      studentId: 'student-301',
      firstName: 'Maya',
      lastName: 'Harris',
      displayName: 'Maya Harris',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya',
      points: 1185,
      totalScore: 59,
      maxScore: 60,
      rank: 1,
      isCurrentStudent: false
    },
    {
      ageGroupId: '16-18',
      ageGroup: 'Ages 16-18',
      studentId: 'student-302',
      firstName: 'Leo',
      lastName: 'Martin',
      displayName: 'Leo Martin',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Leo',
      points: 1128,
      totalScore: 56,
      maxScore: 60,
      rank: 2,
      isCurrentStudent: false
    },
    {
      ageGroupId: '16-18',
      ageGroup: 'Ages 16-18',
      studentId: 'student-303',
      firstName: 'Zoe',
      lastName: 'Clark',
      displayName: 'Zoe Clark',
      avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe',
      points: 1096,
      totalScore: 55,
      maxScore: 60,
      rank: 3,
      isCurrentStudent: false
    }
  ];

  getLeaderboardView(
    filters: LeaderboardFilterState,
    ageGroups: AgeGroupDto[] = []
  ): { entries: LeaderboardEntryDto[]; currentStudent: LeaderboardCurrentStudentDto | null } {
    const normalizedAgeGroupId = filters.ageGroupId?.trim() ?? '';
    const filtered = this.mockEntries.filter((entry) => {
      if (normalizedAgeGroupId && entry.ageGroupId !== normalizedAgeGroupId) {
        return false;
      }
      return true;
    });

    const periodFactor = this.getPeriodFactor(filters.period);
    const entries: LeaderboardEntryDto[] = filtered
      .map((entry, index) => ({
        ...entry,
        points: Math.round(entry.points * periodFactor),
        totalScore: Math.max(1, Math.round(entry.totalScore * periodFactor)),
        maxScore: entry.maxScore,
        rank: index + 1,
        isCurrentStudent: false
      }))
      .sort((a, b) => b.points - a.points)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        isCurrentStudent: entry.studentId === 'student-001'
      }));

    const topEntry = entries[0] ?? null;
    const currentStudent: LeaderboardCurrentStudentDto | null = topEntry
      ? {
          rank: topEntry.rank,
          points: topEntry.points,
          totalScore: topEntry.totalScore,
          maxScore: topEntry.maxScore
        }
      : null;

    return {
      entries,
      currentStudent
    };
  }

  getAgeGroupOptions(ageGroups: AgeGroupDto[]): Array<{ id: string; name: string }> {
    return [{ id: 'all', name: 'All Age Groups' }, ...ageGroups.map((group) => ({ id: group.id, name: group.name }))];
  }

  private getPeriodFactor(period: LeaderboardPeriod): number {
    switch (period) {
      case 'week':
        return 0.72;
      case 'month':
        return 0.9;
      default:
        return 1;
    }
  }
}
