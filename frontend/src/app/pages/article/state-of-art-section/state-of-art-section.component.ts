import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../../core/services/ui-state.service';
import { MATH } from '../../../data/math.data';

@Component({
  selector: 'app-state-of-art-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './state-of-art-section.component.html',
  host: { class: 'block' }
})
export class StateOfArtSectionComponent {
  ui = inject(UiStateService);
  math = MATH;
}