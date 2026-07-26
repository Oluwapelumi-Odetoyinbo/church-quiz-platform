import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="bg-white rounded-xl shadow-md p-8 text-center">
        <i class="pi pi-chart-bar text-green-500 text-4xl mb-4"></i>
        <h1 class="text-2xl font-bold text-gray-800">Result</h1>
        <p class="text-gray-500 mt-2">Quiz results will be displayed here.</p>
      </div>
    </div>
  `
})
export class ResultComponent {}
