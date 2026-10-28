import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../core/services/ui-state.service';
import { ARTICLE_SECTIONS, ArticleSection } from '../../data/sections.data';
import { AbstractSectionComponent } from './abstract-section/abstract-section.component';
import { IntroSectionComponent } from './intro-section/intro-section.component';
import { StateOfArtSectionComponent } from './state-of-art-section/state-of-art-section.component';
import { ConceptsSectionComponent } from './concepts-section/concepts-section.component';
import { ComparisonSectionComponent } from './comparison-section/comparison-section.component';
import { DevelopmentSectionComponent } from './development-section/development-section.component';
import { ResultsSectionComponent } from './results-section/results-section.component';
import { ConclusionsSectionComponent } from './conclusions-section/conclusions-section.component';
import { FutureWorkSectionComponent } from './future-work-section/future-work-section.component';
import { ReferencesSectionComponent } from './references-section/references-section.component';

declare const renderMathInElement: any;
declare const lucide: any;

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    AbstractSectionComponent, IntroSectionComponent, StateOfArtSectionComponent,
    ConceptsSectionComponent, ComparisonSectionComponent, DevelopmentSectionComponent,
    ResultsSectionComponent, ConclusionsSectionComponent, FutureWorkSectionComponent,
    ReferencesSectionComponent
  ],
  templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit, AfterViewInit, OnDestroy {
  ui = inject(UiStateService);
  sections: ArticleSection[] = ARTICLE_SECTIONS;
  indexFilterQuery = '';
  readingProgress = 0;
  showBackToTop = false;
  activeSection = 'section-header';
  readingMinutes = 16;
  wordCount = 4200;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initMathAndIcons();
      setTimeout(() => this.calculateWordCount(), 500);
    }
  }

  ngOnDestroy() {}

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
    }, 300);
  }

  calculateWordCount() {
    const el = document.getElementById('main-article-content');
    if (el) {
      const words = (el.innerText || '').trim().split(/\s+/).filter(Boolean).length;
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
    const sectionEls = document.querySelectorAll('.article-section');
    sectionEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= 180 && rect.bottom >= 120) {
        this.activeSection = el.getAttribute('id') || this.activeSection;
      }
    });
  }
}
