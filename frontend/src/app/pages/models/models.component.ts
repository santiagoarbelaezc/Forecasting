import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStateService } from '../../core/services/ui-state.service';
import { MODELS_EXPLAINER_DATA, ModelExplainer } from '../../data/models-explainer.data';
import { ModelDetailModalComponent } from './model-detail-modal/model-detail-modal.component';

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [CommonModule, ModelDetailModalComponent],
  templateUrl: './models.component.html'
})
export class ModelsComponent {
  ui = inject(UiStateService);
  modelsData = MODELS_EXPLAINER_DATA;
  modelFilter: string = 'todos';
  selectedModel: ModelExplainer | null = null;

  get filteredModels(): ModelExplainer[] {
    if (this.modelFilter === 'todos') return this.modelsData;
    return this.modelsData.filter(m => m.type === this.modelFilter);
  }

  onMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }

  openModal(m: ModelExplainer) {
    this.selectedModel = m;
    setTimeout(() => {
      if (typeof (window as any)['renderMathInElement'] === 'function') {
        const el = document.getElementById('model-detail-modal');
        if (el) (window as any)['renderMathInElement'](el, { throwOnError: false });
      }
    }, 80);
  }
}
