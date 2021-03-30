import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ag-grid TextBoxRenderer
import { AgGridModule } from '@ag-grid-community/angular';
import { AppComponent } from './app.component';

import { DetailCellRenderer } from './detail-cell-renderer.component';
import { TextBoxRenderer } from './TextBoxRenderer.component';
@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgGridModule.withComponents([DetailCellRenderer,TextBoxRenderer]),
  ],
  declarations: [AppComponent, DetailCellRenderer,TextBoxRenderer],
  bootstrap: [AppComponent],
})
export class AppModule {}
