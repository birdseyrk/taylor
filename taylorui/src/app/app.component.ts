import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ElevationService } from './elevation.service';

import { HomeComponent } from './home/home.component';
import { ElevationComponent } from './elevation/elevation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    ElevationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'taylorui';
}
