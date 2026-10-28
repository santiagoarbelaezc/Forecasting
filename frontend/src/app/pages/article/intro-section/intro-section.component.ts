import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../../core/services/ui-state.service';
import { MATH } from '../../../data/math.data';

@Component({
  selector: 'app-intro-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intro-section.component.html',
  host: { class: 'block' }
})
export class IntroSectionComponent {
  ui = inject(UiStateService);
  math = MATH;
}