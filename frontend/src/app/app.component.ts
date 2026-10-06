import { Component, OnInit, AfterViewInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const renderMathInElement: any;
declare const lucide: any;

export interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  snippet: string;
}

export interface MetricVariable {
  name: string;
  unit: string;
  category: string;
  varVal: number;
  lstmVal: number;
  tsmixerVal: number;
  itransformerVal: number;
  arimaVal: number;
  winner: 'iTransformer' | 'VAR' | 'TSMixer' | 'ARIMA' | 'LSTM';
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

  // Math equations rendered via KaTeX
  math = {
    eqVAR: '$$y_t = c + A_1 y_{t-1} + A_2 y_{t-2} + \\dots + A_p y_{t-p} + \\varepsilon_t$$',
    eqRNN: '$$h_t = f(x_t, h_{t-1})$$',
    eqLSTM_f: '$$f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)$$',
    eqLSTM_i: '$$i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)$$',
    eqLSTM_c_tilde: '$$\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)$$',
    eqLSTM_c: '$$C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t$$',
    eqLSTM_o: '$$o_t = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o)$$',
    eqLSTM_h: '$$h_t = o_t \\odot \\tanh(C_t)$$',
    eqMAE: '$$\\text{MAE} = \\frac{1}{N} \\sum_{i=1}^N |y_i - \\hat{y}_i|$$',
    eqMSE: '$$\\text{MSE} = \\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2$$',
    eqRMSE: '$$\\text{RMSE} = \\sqrt{\\text{MSE}} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (y_i - \\hat{y}_i)^2}$$',
    eqnRMSE: '$$\\text{nRMSE}_j = \\frac{\\text{RMSE}_j}{\\sigma_j}$$',
    eqTaylor: '$$\\text{RMSE}^2 = \\text{RMSE}_c^2 + \\text{sesgo}^2$$',
    eqTaylorInline: '\\(\\text{RMSE}^2 = \\text{RMSE}_c^2 + \\text{sesgo}^2\\)',
    complexityARIMA: '\\(\\mathcal{O}(K \\cdot p \\cdot q)\\)',
    eqHSubTMinusOne: '\\(h_{t-1}\\)',
    tsmixerMatrix: '\\(\\mathbf{X} \\in \\mathbb{R}^{L \\times K}\\)',
    windFormula: '\\(\\text{Wind}_x = \\cos(\\theta), \\;\\text{Wind}_y = \\sin(\\theta)\\)',
    complexityVAR: '\\(\\mathcal{O}(p \\cdot K^2)\\)',
    complexityLSTM: '\\(\\mathcal{O}(L \\cdot d^2)\\)',
    complexityTSMixer: '\\(\\mathcal{O}(L^2 + K^2)\\) lineal en capas',
    complexityITransformer: '\\(\\mathcal{O}(K^2 + L \\cdot D)\\)',
    itransformerComplexity: '\\(\\mathcal{O}(L^2)\\)',
    lstmStateText: 'En una RNN convencional, el estado oculto \\(h_t\\) se obtiene a partir de la entrada actual \\(x_t\\) y del estado correspondiente al instante anterior \\(h_{t-1}\\):'
  };

  // Modals state
  isSearchOpen = false;
  isCitationOpen = false;
  isLightboxOpen = false;
  isMobileTocOpen = false;
  showBackToTop = false;

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
  readingMinutes = 16;
  wordCount = 4200;
  readingProgress = 0;
  activeSection = 'section-header';

  // Table IV Variables interactive filtering
  selectedCategory = 'Todas';
  selectedWinner = 'Todos';
  variableSearch = '';

  categories: string[] = [
    'Todas',
    'Térmicas',
    'Humedad y Vapor',
    'Presión y Densidad',
    'Viento y Dinámica',
    'Radiación Solar',
    'Precipitación y Lluvia',
    'Calidad del Aire'
  ];

  winnerFilters: string[] = ['Todos', 'iTransformer', 'VAR', 'TSMixer', 'ARIMA'];

  tableVariables: MetricVariable[] = [
    { name: 'Presión atmosférica', unit: 'mbar', category: 'Presión y Densidad', varVal: 2.553, lstmVal: 3.910, tsmixerVal: 4.279, itransformerVal: 4.030, arimaVal: 2.516, winner: 'ARIMA' },
    { name: 'Temperatura', unit: '°C', category: 'Térmicas', varVal: 6.212, lstmVal: 2.900, tsmixerVal: 2.437, itransformerVal: 2.154, arimaVal: 3.260, winner: 'iTransformer' },
    { name: 'Temperatura potencial', unit: 'K', category: 'Térmicas', varVal: 6.274, lstmVal: 2.989, tsmixerVal: 2.448, itransformerVal: 2.202, arimaVal: 6.396, winner: 'iTransformer' },
    { name: 'Temperatura de rocío', unit: '°C', category: 'Térmicas', varVal: 1.821, lstmVal: 1.905, tsmixerVal: 1.845, itransformerVal: 1.851, arimaVal: 1.855, winner: 'VAR' },
    { name: 'Humedad relativa', unit: '%', category: 'Humedad y Vapor', varVal: 24.62, lstmVal: 13.37, tsmixerVal: 12.13, itransformerVal: 10.19, arimaVal: 12.28, winner: 'iTransformer' },
    { name: 'Presión de vapor de saturación', unit: 'mbar', category: 'Humedad y Vapor', varVal: 5.541, lstmVal: 2.282, tsmixerVal: 1.851, itransformerVal: 1.476, arimaVal: 1.982, winner: 'iTransformer' },
    { name: 'Presión de vapor real', unit: 'mbar', category: 'Humedad y Vapor', varVal: 0.981, lstmVal: 1.037, tsmixerVal: 1.015, itransformerVal: 1.027, arimaVal: 0.996, winner: 'VAR' },
    { name: 'Déficit de presión de vapor', unit: 'mbar', category: 'Humedad y Vapor', varVal: 5.250, lstmVal: 1.966, tsmixerVal: 1.460, itransformerVal: 1.151, arimaVal: 1.514, winner: 'iTransformer' },
    { name: 'Humedad específica', unit: 'g/kg', category: 'Humedad y Vapor', varVal: 0.619, lstmVal: 0.659, tsmixerVal: 0.653, itransformerVal: 0.648, arimaVal: 0.630, winner: 'VAR' },
    { name: 'Concentración de vapor de agua', unit: 'mmol/mol', category: 'Humedad y Vapor', varVal: 0.989, lstmVal: 1.048, tsmixerVal: 1.051, itransformerVal: 1.036, arimaVal: 1.006, winner: 'VAR' },
    { name: 'Densidad del aire', unit: 'g/m³', category: 'Presión y Densidad', varVal: 27.76, lstmVal: 14.47, tsmixerVal: 13.96, itransformerVal: 12.31, arimaVal: 24.20, winner: 'iTransformer' },
    { name: 'Velocidad del viento', unit: 'm/s', category: 'Viento y Dinámica', varVal: 1.424, lstmVal: 1.312, tsmixerVal: 1.244, itransformerVal: 1.287, arimaVal: 1.412, winner: 'TSMixer' },
    { name: 'Velocidad máxima del viento', unit: 'm/s', category: 'Viento y Dinámica', varVal: 2.363, lstmVal: 2.056, tsmixerVal: 1.866, itransformerVal: 1.856, arimaVal: 2.027, winner: 'iTransformer' },
    { name: 'Precipitación', unit: 'mm', category: 'Precipitación y Lluvia', varVal: 0.0285, lstmVal: 0.0310, tsmixerVal: 0.0303, itransformerVal: 0.0308, arimaVal: 0.0269, winner: 'ARIMA' },
    { name: 'Duración de la lluvia', unit: 's', category: 'Precipitación y Lluvia', varVal: 100.41, lstmVal: 103.85, tsmixerVal: 102.79, itransformerVal: 102.69, arimaVal: 112.60, winner: 'VAR' },
    { name: 'Radiación de onda corta', unit: 'W/m²', category: 'Radiación Solar', varVal: 215.87, lstmVal: 106.27, tsmixerVal: 71.62, itransformerVal: 62.80, arimaVal: 106.48, winner: 'iTransformer' },
    { name: 'PAR', unit: 'µmol/m²/s', category: 'Radiación Solar', varVal: 424.25, lstmVal: 208.78, tsmixerVal: 136.68, itransformerVal: 119.75, arimaVal: 205.59, winner: 'iTransformer' },
    { name: 'PAR máxima', unit: 'µmol/m²/s', category: 'Radiación Solar', varVal: 518.04, lstmVal: 260.10, tsmixerVal: 178.07, itransformerVal: 140.98, arimaVal: 234.18, winner: 'iTransformer' },
    { name: 'Temperatura de registro', unit: '°C', category: 'Térmicas', varVal: 6.598, lstmVal: 3.262, tsmixerVal: 2.528, itransformerVal: 2.203, arimaVal: 4.420, winner: 'iTransformer' },
    { name: 'CO₂', unit: 'ppm', category: 'Calidad del Aire', varVal: 24.50, lstmVal: 17.26, tsmixerVal: 14.41, itransformerVal: 11.68, arimaVal: 13.72, winner: 'iTransformer' },
    { name: 'Dirección del viento (seno)', unit: '–', category: 'Viento y Dinámica', varVal: 0.457, lstmVal: 0.482, tsmixerVal: 0.462, itransformerVal: 0.453, arimaVal: 0.487, winner: 'iTransformer' },
    { name: 'Dirección del viento (coseno)', unit: '–', category: 'Viento y Dinámica', varVal: 0.611, lstmVal: 0.530, tsmixerVal: 0.508, itransformerVal: 0.513, arimaVal: 0.534, winner: 'TSMixer' }
  ];

  // Sections definition for index and quick jump
  sections = [
    { id: 'section-header', num: '00', title: 'Encabezado & Autores' },
    { id: 'section-abstract', num: '01', title: 'Resumen (Abstract) & Términos' },
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
      title: 'Desarrollo Experimental (CRISP-DM)',
      children: [
        { id: 'section-dataset', num: 'A.', title: 'Conjunto de Datos Meteorológicos' },
        { id: 'section-preproc', num: 'B.', title: 'Preparación de Datos (Tabla I)' },
        { id: 'section-analisis-estadistico', num: 'C.', title: 'Análisis Exploratorio y ADF' },
        { id: 'section-modelos-config', num: 'D.', title: 'Modelos & Configuración (Tabla II)' },
        { id: 'section-evaluacion-metricas', num: 'E.', title: 'Protocolo de Evaluación & Métricas' },
        { id: 'section-resultados', num: 'F.', title: 'Resultados (Tablas III & IV, Figs. 12-13)' }
      ]
    },
    { id: 'section-conclusiones', num: 'V.', title: 'Conclusiones' },
    { id: 'section-futuros', num: 'VI.', title: 'Trabajo Futuro' },
    { id: 'section-referencias', num: 'VII.', title: 'Referencias Bibliográficas' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Normal init
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
    }, 200);
  }

  get filteredVariables(): MetricVariable[] {
    return this.tableVariables.filter(v => {
      const matchCat = this.selectedCategory === 'Todas' || v.category === this.selectedCategory;
      const matchWin = this.selectedWinner === 'Todos' || v.winner === this.selectedWinner;
      const matchSearch = !this.variableSearch.trim() || 
        v.name.toLowerCase().includes(this.variableSearch.toLowerCase()) ||
        v.unit.toLowerCase().includes(this.variableSearch.toLowerCase());
      return matchCat && matchWin && matchSearch;
    });
  }

  calculateWordCount() {
    const el = document.getElementById('main-article-content');
    if (el) {
      const text = el.innerText || '';
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      this.wordCount = words;
      this.readingMinutes = Math.max(1, Math.round(words / 220));
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.readingProgress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    this.showBackToTop = scrollTop > 350;

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
      const paragraphs = section.querySelectorAll('p, .figure-caption, td, th, li');

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
    this.openSearch();
    this.onSearchInput(term);
  }

  jumpToSection(id: string) {
    this.closeAllModals();
    this.isMobileTocOpen = false;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
      setTimeout(() => {
        target.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
      }, 2000);
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
    navigator.clipboard.writeText(this.bibtexTemplate).then(() => {
      this.bibtexFeedback = '¡Copiado con éxito!';
      setTimeout(() => this.bibtexFeedback = 'Copiar BibTeX', 2000);
    });
  }

  copyIeee() {
    const ieee = `M. A. Mira Ortega, S. Arbelaez Contreras, and J. M. Isaza Vergara, "Estudio comparativo de VAR, LSTM, TSMixer e iTransformer para el pronóstico de series de tiempo meteorológicas multivariadas," Seminario de Investigación · Modelos Arq, 2026.`;
    navigator.clipboard.writeText(ieee).then(() => {
      this.ieeeFeedback = '¡Copiado con éxito!';
      setTimeout(() => this.ieeeFeedback = 'Copiar IEEE', 2000);
    });
  }

  downloadPdf() {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  scrollToTop() {
    if (!isPlatformBrowser(this.platformId)) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeAllModals() {
    this.isSearchOpen = false;
    this.isCitationOpen = false;
    this.isLightboxOpen = false;
  }
}
