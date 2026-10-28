import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  ui = inject(UiStateService);
  router = inject(Router);
  scrolled = false;
  isMobileMenuOpen = false;

  @HostListener('window:scroll', [])
  onScroll() { this.scrolled = window.scrollY > 20; }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  goToSection(sectionId: string) {
    this.closeMobileMenu();
    if (this.router.url !== '/articulo') {
      this.router.navigate(['/articulo']).then(() => {
        setTimeout(() => this.ui.jumpToSection(sectionId), 300);
      });
    } else {
      this.ui.jumpToSection(sectionId);
    }
  }

  triggerSearch() {
    this.closeMobileMenu();
    this.ui.openSearch();
  }

  triggerCitation() {
    this.closeMobileMenu();
    this.ui.openCitation();
  }
}
