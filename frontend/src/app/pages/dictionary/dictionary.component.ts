import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../core/services/ui-state.service';
import { DICTIONARY_DATA, DictionaryEntry } from '../../data/dictionary.data';

@Component({
  selector: 'app-dictionary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dictionary.component.html'
})
export class DictionaryComponent {
  ui = inject(UiStateService);
  dictionaryData = DICTIONARY_DATA;
  Math = Math;
  search = '';
  selectedCategory = 'Todas';
  categories = ['Todas', 'Modelos', 'Variables Meteorológicas', 'Conceptos Estadísticos', 'Métricas', 'Deep Learning', 'Metodología'];

  get filtered(): DictionaryEntry[] {
    const q = this.search.trim().toLowerCase();
    return this.dictionaryData.filter(item => {
      const matchCat = this.selectedCategory === 'Todas' || item.category === this.selectedCategory;
      const matchQ = !q || item.term.toLowerCase().includes(q) || item.shortDesc.toLowerCase().includes(q)
        || item.extendedDesc.toLowerCase().includes(q) || item.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }

  onMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }
}
