//Angular Widgets

import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

//NG Prime Widgets
//import { PrimeNGConfig } from 'primeng/api'; 
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { ChipModule } from 'primeng/chip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DragDropModule } from 'primeng/dragdrop';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
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

//Services
import { ElevationService } from './elevation.service';
import { LoggingService } from './logging.service';
import { OperationsService } from './operations.service';
import { provideHttpClient, withFetch } from '@angular/common/http';

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
    AvatarModule,
    AvatarGroupModule,
    ButtonModule,
    CalendarModule,
    ChartModule,
    ChipModule,
    ConfirmPopupModule,
    DialogModule,
    DividerModule,
    DragDropModule,
    FileUploadModule,
    FloatLabelModule,
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
    provideClientHydration(),
    provideHttpClient(withFetch()),
    ElevationService,
    LoggingService,
    OperationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
