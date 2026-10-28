import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../../core/services/ui-state.service';
import { MATH } from '../../../data/math.data';
import { MetricVariable, RESULT_CATEGORIES, WINNER_FILTERS, TABLE_VARIABLES } from '../../../data/results.data';

@Component({
  selector: 'app-results-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './results-section.component.html',
  host: { class: 'block' }
})
export class ResultsSectionComponent {
  ui = inject(UiStateService);
  math = MATH;

  selectedCategory = 'Todas';
  selectedWinner = 'Todos';
  variableSearch = '';
  categories = RESULT_CATEGORIES;
  winnerFilters = WINNER_FILTERS;
  tableVariables = TABLE_VARIABLES;

  get filteredVariables(): MetricVariable[] {
    return this.tableVariables.filter(v => {
      const matchCat = this.selectedCategory === 'Todas' || v.category === this.selectedCategory;
      const matchWin = this.selectedWinner === 'Todos' || v.winner === this.selectedWinner;
      const q = this.variableSearch.trim().toLowerCase();
      const matchSearch = !q || v.name.toLowerCase().includes(q) || v.unit.toLowerCase().includes(q);
      return matchCat && matchWin && matchSearch;
    });
  }
}