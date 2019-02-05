import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AppComponent } from './app.component';
import {AgGridModule} from "ag-grid-angular"
import {PivotHeaderComponent} from './pivot-header/pivot-header.component'

@NgModule({
  imports:      [ BrowserModule, FormsModule, AgGridModule.withComponents([]), HttpClientModule ],
  entryComponents: [
    PivotHeaderComponent
  ],
  declarations: [ AppComponent, PivotHeaderComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
