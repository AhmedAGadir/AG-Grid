import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColDef } from 'ag-grid';

@Component({
  selector: 'app-ag-grid-style-settings',
  templateUrl: './ag-grid-style-settings.component.html',
  styleUrls: ['./ag-grid-style-settings.component.css']
})
export class AgGridStyleSettingsComponent implements OnInit {
  @Input() columnDefs: ColDef[] = [];
  @Output() onHeaderSettingsApply = new EventEmitter<any>();
  @Output() onClearHeaderSettings = new EventEmitter<any>();
  isHeaderSettings = false;

  headerSettings = {
    bgColor: '#96d7f2',
    color: '#ffffff',
    fontSize: 10
  };

  constructor() { }

  ngOnInit() {
  }


  openHeaderSettings() {
     this.isHeaderSettings = !this.isHeaderSettings;
  }

  applyHeaderSettings() {
    this.onHeaderSettingsApply.emit(this.headerSettings);
  }

  clearHeaderSettings() {
    this.onClearHeaderSettings.emit();
  }
}