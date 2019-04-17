import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MyCellRenderer } from './my-cell-renderer.component';

// ag-grid
import { AgGridModule } from 'ag-grid-angular';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule, 
    AgGridModule.withComponents([MyCellRenderer]),
    FileUploadModule
  ],
  declarations: [ AppComponent, MyCellRenderer ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
