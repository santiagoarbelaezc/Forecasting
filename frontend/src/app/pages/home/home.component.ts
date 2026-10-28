import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiStateService } from '../../core/services/ui-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  ui = inject(UiStateService);

  models = ['VAR', 'ARIMA', 'ARIMAX', 'LSTM', 'TSMixer', 'iTransformer'];
  currentModelIdx = 0;

  ngOnInit() {
    setInterval(() => {
      this.currentModelIdx = (this.currentModelIdx + 1) % this.models.length;
    }, 1800);
  }
}
