import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStateService } from '../../../core/services/ui-state.service';
import { ModelExplainer } from '../../../data/models-explainer.data';

@Component({
  selector: 'app-model-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model-detail-modal.component.html'
})
export class ModelDetailModalComponent {
  @Input() model!: ModelExplainer;
  @Output() close = new EventEmitter<void>();
  ui = inject(UiStateService);
}
