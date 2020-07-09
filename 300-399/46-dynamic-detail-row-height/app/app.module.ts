import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ag-grid
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';

import { DetailCellRenderer } from './detail-cell-renderer.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgGridModule.withComponents([DetailCellRenderer]),
  ],
  declarations: [AppComponent, DetailCellRenderer],
  bootstrap: [AppComponent],
})
export class AppModule {}
