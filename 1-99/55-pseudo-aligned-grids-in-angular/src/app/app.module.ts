import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule }   from '@angular/forms'; // <-- NgModel lives here
import {HttpClientModule} from '@angular/common/http';

// ag-grid
import { AgGridModule }  from "ag-grid-angular";


import { AppComponent } from './app.component';
import { AgGridExampleComponent } from './ag-grid-example/ag-grid-example.component';


@NgModule({
  declarations: [
    AppComponent,
    AgGridExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
    HttpClientModule,
    AgGridModule.withComponents([ ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
