import { Component, OnInit, AfterViewInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const renderMathInElement: any;
declare const lucide: any;

interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  snippet: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Estudio comparativo de VAR, LSTM, TSMixer e iTransformer';

  math = {
    eqVAR: '$$y_t = c + A_1 y_{t-1} + A_2 y_{t-2} + \\dots + A_p y_{t-p} + \\varepsilon_t$$',
    eqRNN: '$$h_t = f(x_t, h_{t-1})$$',
    eqLSTM_f: '$$f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)$$',
    eqLSTM_i: '$$i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)$$',
    eqLSTM_c_tilde: '$$\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)$$',
    eqLSTM_c: '$$C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t$$',
    eqLSTM_o: '$$o_t = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o)$$',
    eqLSTM_h: '$$h_t = o_t \\odot \\tanh(C_t)$$',
    tsmixerMatrix: '\\(\\mathbf{X} \\in \\mathbb{R}^{L \\times K}\\)',
    windFormula: '\\(\\text{Wind}_x = \\cos(\\theta), \\;\\text{Wind}_y = \\sin(\\theta)\\)',
    complexityVAR: '\\(\\mathcal{O}(p \\cdot K^2)\\)',
    complexityLSTM: '\\(\\mathcal{O}(L \\cdot d^2)\\)',
    complexityTSMixer: '\\(\\mathcal{O}(L^2 + K^2)\\) lineal en capas',
    complexityITransformer: '\\(\\mathcal{O}(K^2 + L \\cdot D)\\)',
    itransformerComplexity: '\\(\\mathcal{O}(L^2)\\)',
    lstmStateText: 'En una RNN convencional, el estado oculto \\(h_t\\) se obtiene a partir de la entrada actual \\(x_t\\) y del estado correspondiente al instante anterior \\(h_{t-1}\\):'
  };


  // Theming
  currentTheme: 'theme-dark' | 'theme-light' | 'theme-red' = 'theme-dark';

  // Modals state
  isSearchOpen = false;
  isCitationOpen = false;
  isLightboxOpen = false;
  isWhyHtmlOpen = false;
  isMobileTocOpen = false;

  // Search state
  searchQuery = '';
  searchResults: SearchResult[] = [];
  indexFilterQuery = '';

  // Lightbox state
  lightboxImg = '';
  lightboxCaption = '';

  // Citation feedback
  bibtexFeedback = 'Copiar BibTeX';
  ieeeFeedback = 'Copiar IEEE';
  bibtexTemplate = `@article{mira2026comparativo,
  title={Estudio comparativo de VAR, LSTM, TSMixer e iTransformer para el pronóstico de series de tiempo meteorológicas multivariadas},
  author={Mira Ortega, Miguel Angel and Arbelaez Contreras, Santiago and Isaza Vergara, Juan Manuel},
  journal={Seminario de Investigación · Modelos Arq},
  year={2026}
}`;

  // Reading info
  readingMinutes = 14;
  wordCount = 3450;
  readingProgress = 0;
  activeSection = 'section-header';

  // Sections definition for index and quick jump
  sections = [
    { id: 'section-header', num: '00', title: 'Encabezado & Autores' },
    { id: 'section-abstract', num: '01', title: 'Resumen (Abstract)' },
    { id: 'section-terminos', num: '02', title: 'Términos Clave' },
    { id: 'section-introduccion', num: 'I.', title: 'Introducción' },
    { id: 'section-estado-arte', num: 'II.', title: 'Estado del Arte' },
    { 
      id: 'section-marco-conceptual', 
      num: 'III.', 
      title: 'Marco Conceptual',
      children: [
        { id: 'section-var', num: 'A.', title: 'Vector Autoregression (VAR)' },
        { id: 'section-lstm', num: 'B.', title: 'Long Short-Term Memory (LSTM)' },
        { id: 'section-tsmixer', num: 'C.', title: 'TSMixer (All-MLP)' },
        { id: 'section-itransformer', num: 'D.', title: 'iTransformer (Inverted Attention)' }
      ]
    },
    { id: 'section-comparativa', num: '★', title: 'Matriz Comparativa de Modelos' },
    { 
      id: 'section-desarrollo', 
      num: 'IV.', 
      title: 'Desarrollo Experimental',
      children: [
        { id: 'section-preproc', num: 'A.', title: 'Preprocesamiento de Datos' },
        { id: 'section-impl-lstm', num: 'B.', title: 'Implementación LSTM (Fig. 7)' },
        { id: 'section-impl-tsmixer', num: 'C.', title: 'Implementación TSMixer (Fig. 8)' },
        { id: 'section-impl-itransformer', num: 'D.', title: 'Implementación iTransformer (Fig. 9)' },
        { id: 'section-impl-var', num: 'E.', title: 'Implementación VAR (Fig. 10)' }
      ]
    },
    { id: 'section-conclusiones', num: 'V.', title: 'Conclusiones' },
    { id: 'section-futuros', num: 'VI.', title: 'Trabajo Futuro' },
    { id: 'section-referencias', num: 'VII.', title: 'Referencias Bibliográficas' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      root.classList.remove('theme-dark', 'theme-red');
      localStorage.removeItem('research_paper_theme');
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initMathAndIcons();
      this.calculateWordCount();
    }
  }

  initMathAndIcons() {
    setTimeout(() => {
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
      }
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }, 150);
  }

  setTheme(theme: 'theme-dark' | 'theme-light' | 'theme-red') {
    this.currentTheme = theme;
    if (isPlatformBrowser(this.platformId)) {
      const root = document.documentElement;
      root.classList.remove('theme-dark', 'theme-light', 'theme-red');
      root.classList.add(theme);
      localStorage.setItem('research_paper_theme', theme);
    }
  }

  calculateWordCount() {
    const el = document.getElementById('main-article-content');
    if (el) {
      const text = el.innerText || '';
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      this.wordCount = words;
      this.readingMinutes = Math.max(1, Math.round(words / 200));
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.readingProgress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

    // Detect active section
    const sectionEls = document.querySelectorAll('.article-section');
    sectionEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 180 && rect.bottom >= 120) {
        this.activeSection = el.getAttribute('id') || this.activeSection;
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.openSearch();
    }
    if (event.key === 'Escape') {
      this.closeAllModals();
    }
  }

  // Search logic
  openSearch() {
    this.isSearchOpen = true;
    this.searchQuery = '';
    this.searchResults = [];
    setTimeout(() => {
      const input = document.getElementById('search-modal-input');
      if (input) input.focus();
    }, 50);
  }

  closeSearch() {
    this.isSearchOpen = false;
  }

  onSearchInput(query: string) {
    this.searchQuery = query;
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) {
      this.searchResults = [];
      return;
    }

    const matches: SearchResult[] = [];
    const sectionEls = document.querySelectorAll('.article-section');

    sectionEls.forEach(section => {
      const sectionId = section.getAttribute('id') || '';
      const sectionTitle = section.querySelector('h2, h3, h1')?.textContent?.trim() || 'Sección';
      const paragraphs = section.querySelectorAll('p, .figure-caption');

      paragraphs.forEach(p => {
        const text = p.textContent || '';
        const matchIdx = text.toLowerCase().indexOf(q);
        if (matchIdx !== -1) {
          const start = Math.max(0, matchIdx - 40);
          const end = Math.min(text.length, matchIdx + q.length + 50);
          let snippet = text.substring(start, end);
          if (start > 0) snippet = '...' + snippet;
          if (end < text.length) snippet = snippet + '...';

          matches.push({
            sectionId,
            sectionTitle,
            snippet
          });
        }
      });
    });

    this.searchResults = matches.slice(0, 15);
  }

  quickSearch(term: string) {
    this.searchQuery = term;
    this.onSearchInput(term);
  }

  jumpToSection(id: string) {
    this.closeAllModals();
    this.isMobileTocOpen = false;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-black');
      setTimeout(() => {
        target.classList.remove('ring-2', 'ring-cyan-400', 'ring-offset-4', 'ring-offset-black');
      }, 2500);
    }
  }

  // Lightbox
  openLightbox(src: string, caption: string) {
    this.lightboxImg = src;
    this.lightboxCaption = caption;
    this.isLightboxOpen = true;
  }

  closeLightbox() {
    this.isLightboxOpen = false;
  }

  // Citation
  openCitation() {
    this.isCitationOpen = true;
  }

  closeCitation() {
    this.isCitationOpen = false;
  }

  copyBibtex() {
    const bibtex = `@article{mira2024comparativo,
  title={Estudio comparativo de VAR, LSTM, TSMixer e iTransformer para el pronóstico de series de tiempo meteorológicas multivariadas},
  author={Mira, Miguel and Arbelaez, Santiago and Isaza, Juan},
  journal={Seminario de Investigación en Forecasting e Inteligencia Artificial},
  year={2026}
}`;
    navigator.clipboard.writeText(bibtex).then(() => {
      this.bibtexFeedback = '¡Copiado con éxito!';
      setTimeout(() => this.bibtexFeedback = 'Copiar BibTeX', 2000);
    });
  }

  copyIeee() {
    const ieee = `M. Mira, S. Arbelaez, and J. Isaza, "Estudio comparativo de VAR, LSTM, TSMixer e iTransformer para el pronóstico de series de tiempo meteorológicas multivariadas," Seminario de Investigación, 2026.`;
    navigator.clipboard.writeText(ieee).then(() => {
      this.ieeeFeedback = '¡Copiado con éxito!';
      setTimeout(() => this.ieeeFeedback = 'Copiar IEEE', 2000);
    });
  }

  // PDF Export
  downloadPdf() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  // Fullscreen
  toggleFullscreen() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  closeAllModals() {
    this.isSearchOpen = false;
    this.isCitationOpen = false;
    this.isLightboxOpen = false;
    this.isWhyHtmlOpen = false;
  }
}
