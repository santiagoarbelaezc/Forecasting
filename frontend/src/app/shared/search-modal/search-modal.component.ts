import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search-modal.component.html'
})
export class SearchModalComponent {
  ui = inject(UiStateService);
}
