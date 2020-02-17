import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
// HttpClient
import { HttpClientModule } from "@angular/common/http";

// ag-grid
import { AgGridModule } from "@ag-grid-community/angular";
import { AppComponent } from "./app.component";

import { SliderFloatingFilter } from "./slider-floating-filter.component";
import { CustomNumberFilter } from "./custom-number-filter.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
    HttpClientModule,
    AgGridModule.withComponents([SliderFloatingFilter, CustomNumberFilter])
  ],
  declarations: [AppComponent, SliderFloatingFilter, CustomNumberFilter],
  bootstrap: [AppComponent]
})
export class AppModule {}
