import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AgGridModule } from "ag-grid-angular";

import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { CompleteProgramComponent } from './complete-program.component';




@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule,
    AgGridModule.withComponents([]), TabViewModule, TabMenuModule],
  declarations: [AppComponent, HelloComponent, CompleteProgramComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
