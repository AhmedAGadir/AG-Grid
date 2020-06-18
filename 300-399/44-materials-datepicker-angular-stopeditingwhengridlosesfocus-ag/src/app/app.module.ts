import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { AgGridModule } from "ag-grid-angular";

import { MyDateEditor } from "./my-date-editor.component";

import { A11yModule } from "@angular/cdk/a11y";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


import { MakeEditor } from './make-editor.component'

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AgGridModule.withComponents([MyDateEditor, MakeEditor]),

    A11yModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatRippleModule,
    BrowserAnimationsModule,
  ],
  declarations: [AppComponent, MyDateEditor, MakeEditor],
  bootstrap: [AppComponent]
})
export class AppModule {}
