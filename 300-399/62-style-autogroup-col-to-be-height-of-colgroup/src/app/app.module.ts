import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from "ag-grid-angular";
import { MyGridApplicationComponent } from "./my-grid-application/my-grid-application.component";
import { AppComponent } from './app.component';
import { AgGridStyleSettingsComponent } from './ag-grid-style-settings/ag-grid-style-settings.component';
import { HeaderComponent } from './header/header.component';




@NgModule({
  imports: [BrowserModule,
    FormsModule,
    AgGridModule.withComponents([HeaderComponent]),
  ],
  declarations: [AppComponent, MyGridApplicationComponent, AgGridStyleSettingsComponent, HeaderComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
