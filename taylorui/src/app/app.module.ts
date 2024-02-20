//Angular Widgets

import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

//NG Prime Widgets
//import { PrimeNGConfig } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
//import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';

import { TableModule } from 'primeng/table';


//Local Widgets
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElevationComponent } from './elevation/elevation.component';

@NgModule({
  declarations: [
    AppComponent,
    ElevationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,

    // NG Prime Widgets
    ButtonModule,
    //CalendarModule,
    InputNumberModule,
    InputTextareaModule,
    InputTextModule,
    MenuModule,
    PanelModule,
    //PrimeNGConfig,
    ScrollPanelModule,
    TableModule,
    TabViewModule,
    ToastModule


  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
