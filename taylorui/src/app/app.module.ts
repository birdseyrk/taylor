import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ElevationComponent } from './elevation/elevation.component';
//import { DataReaderComponent } from './data-reader/data-reader.component';
import { OperationsDataComponent } from './operations-data/operations-data.component';

//NG Prime Widgets
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
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';

//Services
import { ElevationService } from './elevation.service';
import { LoggingService } from './logging.service';
import { OperationsService } from './operations.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ElevationComponent,
    //DataReaderComponent,
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
    PasswordModule,
    //PrimeNGConfig,
    ScrollPanelModule,
    TableModule,
    TabViewModule,
    ToastModule
  ],
  providers: [
    ElevationService,
    LoggingService,
    OperationsService,
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
