import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  snippet: string;
}

@Injectable({ providedIn: 'root' })
export class UiStateService {
  private router = inject(Router);

  // ---- Search ----
  isSearchOpen = false;
  searchQuery = '';
  searchResults: SearchResult[] = [];

  openSearch() {
    this.isSearchOpen = true;
    this.searchQuery = '';
    this.searchResults = [];
    setTimeout(() => {
      const input = document.getElementById('search-modal-input');
      if (input) (input as HTMLInputElement).focus();
    }, 50);
  }

  closeSearch() { this.isSearchOpen = false; }

  onSearchInput(query: string) {
    this.searchQuery = query;
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) { this.searchResults = []; return; }
    const matches: SearchResult[] = [];
    const sectionEls = document.querySelectorAll('.article-section');
    sectionEls.forEach(section => {
      const sectionId = section.getAttribute('id') || '';
      const sectionTitle = section.querySelector('h2, h3, h1')?.textContent?.trim() || 'Sección';
      section.querySelectorAll('p, .figure-caption, td, th, li').forEach(p => {
        const text = p.textContent || '';
        const idx = text.toLowerCase().indexOf(q);
        if (idx !== -1) {
          const start = Math.max(0, idx - 40);
          const end = Math.min(text.length, idx + q.length + 50);
          let snippet = text.substring(start, end);
          if (start > 0) snippet = '...' + snippet;
          if (end < text.length) snippet += '...';
          matches.push({ sectionId, sectionTitle, snippet });
        }
      });
    });
    this.searchResults = matches.slice(0, 15);
  }

  quickSearch(term: string) {
    this.searchQuery = term;
    this.openSearch();
    this.onSearchInput(term);
  }

  jumpToSection(id: string) {
    this.closeSearch();
    this.isMobileTocOpen = false;
    const go = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('ring-2', 'ring-crimson-accent', 'ring-offset-2');
        setTimeout(() => target.classList.remove('ring-2', 'ring-crimson-accent', 'ring-offset-2'), 2000);
      }
    };
    const currentUrl = this.router.url.split('?')[0];
    if (!currentUrl.startsWith('/articulo')) {
      this.router.navigate(['/articulo']).then(() => setTimeout(go, 400));
    } else {
      go();
    }
  }

  // ---- Lightbox ----
  isLightboxOpen = false;
  lightboxImg = '';
  lightboxCaption = '';
  openLightbox(src: string, caption: string) {
    this.lightboxImg = src; this.lightboxCaption = caption; this.isLightboxOpen = true;
  }
  closeLightbox() { this.isLightboxOpen = false; }

  // ---- Citation ----
  isCitationOpen = false;
  bibtexFeedback = 'Copiar BibTeX';
  ieeeFeedback = 'Copiar IEEE';
  bibtexTemplate = `@article{mira2026comparativo,
  title={Estudio comparativo de VAR, LSTM, TSMixer e iTransformer para el pronóstico de series de tiempo meteorológicas multivariadas},
  author={Mira Ortega, Miguel Angel and Arbelaez Contreras, Santiago and Isaza Vergara, Juan Manuel},
  journal={Seminario de Grado},
  year={2026}
}`;

  ieeeTemplate = `M. A. Mira Ortega, S. Arbelaez Contreras, and J. M. Isaza Vergara, "Estudio comparativo de VAR, LSTM, TSMixer e iTransformer para el pronóstico de series de tiempo meteorológicas multivariadas," Seminario de Grado, 2026.`;

  openCitation() { this.isCitationOpen = true; }
  closeCitation() { this.isCitationOpen = false; }
  copyBibtex() {
    navigator.clipboard.writeText(this.bibtexTemplate).then(() => {
      this.bibtexFeedback = '¡Copiado!';
      setTimeout(() => this.bibtexFeedback = 'Copiar BibTeX', 2000);
    });
  }
  copyIeee() {
    navigator.clipboard.writeText(this.ieeeTemplate).then(() => {
      this.ieeeFeedback = '¡Copiado!';
      setTimeout(() => this.ieeeFeedback = 'Copiar IEEE', 2000);
    });
  }

  // ---- Misc ----
  isMobileTocOpen = false;

  closeAllModals() {
    this.isSearchOpen = false;
    this.isCitationOpen = false;
    this.isLightboxOpen = false;
    this.isMobileTocOpen = false;
  }

  scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

  downloadPdf() { window.print(); }
}
