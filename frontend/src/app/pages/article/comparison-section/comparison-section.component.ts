import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../../core/services/ui-state.service';
import { MATH } from '../../../data/math.data';

@Component({
  selector: 'app-comparison-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparison-section.component.html',
  host: { class: 'block' }
})
export class ComparisonSectionComponent {
  ui = inject(UiStateService);
  math = MATH;
}