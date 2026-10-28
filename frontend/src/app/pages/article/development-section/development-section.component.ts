import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../../core/services/ui-state.service';
import { MATH } from '../../../data/math.data';
import { ResultsSectionComponent } from '../results-section/results-section.component';
@Component({
  selector: 'app-development-section',
  standalone: true,
  imports: [CommonModule, FormsModule, ResultsSectionComponent],
  templateUrl: './development-section.component.html',
  host: { class: 'block' }
})
export class DevelopmentSectionComponent {
  ui = inject(UiStateService);
  math = MATH;
}