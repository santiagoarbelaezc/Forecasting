import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-citation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citation-modal.component.html'
})
export class CitationModalComponent {
  ui = inject(UiStateService);
}
