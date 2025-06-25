import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from '@core/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutComponent],
  template: `<app-layout>
              <router-outlet></router-outlet>
            </app-layout>`
})
export class App { }
