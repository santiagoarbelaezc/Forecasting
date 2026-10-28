import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  ui = inject(UiStateService);
  scrolled = false;

  @HostListener('window:scroll', [])
  onScroll() { this.scrolled = window.scrollY > 20; }
}
