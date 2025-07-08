import { Component, input } from '@angular/core';
import { IntervalWinProducer } from '@shared/models/interval-win.model';

@Component({
  selector: 'app-interval-winners-table',
  imports: [],
  templateUrl: './interval-winners-table.component.html',
  styleUrl: './interval-winners-table.component.scss'
})
export class IntervalWinnersTableComponent {

  public loading = input<boolean>(false);
  public intervalWinProducer = input<IntervalWinProducer[]>([]);
}
