// Angular Widgets
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// PrimeNG Widgets
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';

// Local Services
import { ElevationService } from './elevation.service';

// Local Widgets
import { HomeComponent } from './home/home.component';
import { ElevationComponent } from './elevation/elevation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [

    // Angular Widgets
    RouterOutlet,

    // PrimeNG widgets
    ButtonModule,
    InputTextareaModule,
    MenuModule,
    PanelModule,
    ScrollPanelModule,
    TableModule,
    TabViewModule,
    ToastModule,

    //Local Widgets
    HomeComponent,
    ElevationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'taylorui';
}
