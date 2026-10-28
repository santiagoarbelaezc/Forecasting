import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../../core/services/ui-state.service';
import { MATH } from '../../../data/math.data';

@Component({
  selector: 'app-concepts-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './concepts-section.component.html',
  host: { class: 'block' }
})
export class ConceptsSectionComponent {
  ui = inject(UiStateService);
  math = MATH;
}