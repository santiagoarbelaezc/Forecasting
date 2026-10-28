import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html'
})
export class FooterComponent {
  ui = inject(UiStateService);
  year = new Date().getFullYear();
}
