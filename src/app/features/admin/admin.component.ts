import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartPoint {
  label: string;
  value: number;
  x: number;
  y: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

interface MetricCard {
  title: string;
  value: string;
  icon: string;
}

interface RecentActivity {
  id: number;
  title: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  activeTab = 'dashboard';

  navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'pi pi-home' },
    { id: 'categories', label: 'Categories & Age Bands', icon: 'pi pi-list' },
    { id: 'leaders', label: 'Leaders', icon: 'pi pi-users' },
    { id: 'questions', label: 'Question Bank', icon: 'pi pi-question-circle' },
    { id: 'audit', label: 'Audit Log', icon: 'pi pi-file' },
    { id: 'analytics', label: 'Analytics', icon: 'pi pi-chart-line' },
  ];

  metricCards: MetricCard[] = [
    { title: 'Total Students', value: '612', icon: 'pi pi-graduation-cap' },
    { title: 'Active Leaders', value: '24', icon: 'pi pi-users' },
    { title: 'Questions in Bank', value: '8,400', icon: 'svg-cards' },
    { title: 'Flags This Week', value: '3', icon: 'svg-flag' },
  ];

  chartPoints: ChartPoint[] = [];
  linePath = '';
  fillPath = '';
  xAxisLabels: { label: string; x: number }[] = [];

  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: ChartPoint | null = null;

  recentActivities: RecentActivity[] = [
    { id: 1, title: 'New leader added', time: 'Today, 2:39 PM', icon: 'pi pi-user-plus' },
    { id: 2, title: '12 questions approved', time: 'Today, 2:39 PM', icon: 'pi pi-check' },
    { id: 3, title: 'Flag reported', time: 'Today, 2:36 PM', icon: 'pi pi-flag' },
  ];

  constructor() {
    this.reloadChartData();
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  getActiveTabLabel(): string {
    return this.navItems.find((item) => item.id === this.activeTab)?.label ?? 'Dashboard';
  }

  handleLogout(): void {
    alert('Logged out successfully (simulation).');
  }

  reloadChartData(): void {
    const data = [
      { label: 'Jun 28', value: 180 },
      { label: 'Jul 01', value: 320 },
      { label: 'Jul 05', value: 280 },
      { label: 'Jul 09', value: 360 },
      { label: 'Jul 13', value: 460 },
      { label: 'Jul 17', value: 330 },
      { label: 'Jul 21', value: 510 },
      { label: 'Jul 25', value: 490 },
      { label: 'Jul 28', value: 690 },
    ];

    this.generateCoordinates(data);
  }

  generateCoordinates(data: { label: string; value: number }[]): void {
    const chartWidth = 600;
    const paddingX = 45;
    const yBottom = 180;
    const yTop = 20;
    const maxValue = 800;
    const xMin = paddingX;
    const xMax = chartWidth - paddingX;

    this.chartPoints = data.map((d, index) => {
      const x = xMin + (index / (data.length - 1)) * (xMax - xMin);
      const y = yBottom - (d.value / maxValue) * (yBottom - yTop);
      return { label: d.label, value: d.value, x: Math.round(x), y: Math.round(y) };
    });

    this.xAxisLabels = this.chartPoints.map((p) => ({ label: p.label, x: p.x }));

    this.linePath = this.computeBezierCurve(this.chartPoints);

    if (this.chartPoints.length > 0) {
      const first = this.chartPoints[0];
      const last = this.chartPoints[this.chartPoints.length - 1];
      this.fillPath = `${this.linePath} L ${last.x} 180 L ${first.x} 180 Z`;
    } else {
      this.fillPath = '';
    }
  }

  computeBezierCurve(pts: ChartPoint[]): string {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    let path = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    return path;
  }

  showTooltip(point: ChartPoint): void {
    this.tooltipData = point;
    this.tooltipX = point.x - 65;
    this.tooltipY = point.y - 45;
    this.tooltipVisible = true;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
    this.tooltipData = null;
  }
}
