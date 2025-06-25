import { Component } from '@angular/core';

import { IntervalWinnersComponent } from './components/interval-winners/interval-winners.component';
import { MoviesByYearComponent } from './components/movies-by-year/movies-by-year.component';
import { TopStudiosWinnersComponent } from './components/top-studios-winners/top-studios-winners.component';
import { YearsMultipleWinnersComponent } from './components/years-multiple-winners/years-winners.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MoviesByYearComponent,
    YearsMultipleWinnersComponent,
    TopStudiosWinnersComponent,
    IntervalWinnersComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
