import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html'
})
export class LightboxComponent {
  ui = inject(UiStateService);
}
