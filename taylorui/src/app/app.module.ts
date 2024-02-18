import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from "@angular/router";

// Prime NG Widgets
// import { ButtonModule } from 'primeng/button';
// import { MenuModule } from 'primeng/menu';
// import { PanelModule } from 'primeng/panel';
// import { ScrollPanelModule } from 'primeng/scrollpanel';
// import { ToastModule } from 'primeng/toast';
// import { TabViewModule } from 'primeng/tabview';
// import { TableModule } from 'primeng/table';
// import { InputTextareaModule } from 'primeng/inputtextarea';

// Angular Widgets
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Angular Created Component Widgets
import { ElevationComponent } from './elevation/elevation.component';

@NgModule({
  declarations: [
    AppComponent,
    ElevationComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    // //RouterModule.forRoot(appRoutes),
    // ButtonModule,
    // InputTextareaModule,
    // MenuModule,
    // PanelModule,
    // ScrollPanelModule,
    // TableModule,
    // TabViewModule,
    // ToastModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
