import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { UiStateService } from './core/services/ui-state.service';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { SearchModalComponent } from './shared/search-modal/search-modal.component';
import { CitationModalComponent } from './shared/citation-modal/citation-modal.component';
import { LightboxComponent } from './shared/lightbox/lightbox.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterModule,
    NavbarComponent, FooterComponent,
    SearchModalComponent, CitationModalComponent, LightboxComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Forecasting Meteorológico';
  ui = inject(UiStateService);

  @HostListener('window:keydown', ['$event'])
  handleKeys(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.ui.openSearch();
    }
    if (event.key === 'Escape') {
      this.ui.closeAllModals();
    }
  }
}
