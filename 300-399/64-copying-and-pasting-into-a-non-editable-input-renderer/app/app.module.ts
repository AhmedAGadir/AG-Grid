import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


// ag-grid
import { AgGridModule } from '@ag-grid-community/angular';
import { AppComponent } from './app.component';
import { ChildMessageRenderer } from './child-message-renderer.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgGridModule.withComponents([ChildMessageRenderer]),
  ],
  declarations: [AppComponent, ChildMessageRenderer],
  bootstrap: [AppComponent],
})
export class AppModule {}

