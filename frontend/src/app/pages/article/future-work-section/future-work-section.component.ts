import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../../core/services/ui-state.service';
import { MATH } from '../../../data/math.data';

@Component({
  selector: 'app-future-work-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './future-work-section.component.html',
  host: { class: 'block' }
})
export class FutureWorkSectionComponent {
  ui = inject(UiStateService);
  math = MATH;
}