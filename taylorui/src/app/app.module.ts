//Angular Widgets

import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

//NG Prime Widgets
//import { PrimeNGConfig } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
//import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';



//Local Widgets
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElevationComponent } from './elevation/elevation.component';
// import { DataReaderComponent } from './data-reader/data-reader.component';
import { OperationsDataComponent } from './operations-data/operations-data.component';

@NgModule({
  declarations: [
    AppComponent,
    ElevationComponent,
    // DataReaderComponent,
    OperationsDataComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,

    // NG Prime Widgets
    ButtonModule,
    //CalendarModule,
    ChartModule,
    DialogModule,
    DividerModule,
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
