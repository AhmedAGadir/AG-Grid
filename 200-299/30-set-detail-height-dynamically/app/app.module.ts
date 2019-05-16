import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
// HttpClient
import { HttpClientModule } from "@angular/common/http";

// ag-grid
import { AgGridModule } from "ag-grid-angular";
import { AppComponent } from "./app.component";

import { DetailsComponent } from "./details.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
    HttpClientModule,
    AgGridModule
  ],
  declarations: [AppComponent, DetailsComponent],
  bootstrap: [AppComponent],
  entryComponents: [DetailsComponent]
})
export class AppModule {}
