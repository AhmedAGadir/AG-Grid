import { Component, ViewChild } from "@angular/core";
import { DetailsComponent } from "./details.component";
import "ag-grid-enterprise";

@Component({
  selector: "my-app",
  template: `
    <div style="height: 100%; box-sizing: border-box;">
      <ag-grid-angular
        #agGrid
        style="width: 100%; height: 100%;"
        id="myGrid"
        class="ag-theme-balham"
        [columnDefs]="columnDefs"
        [rowData]="rowData"
        [masterDetail]="true"
        [detailCellRenderer]="'details'"
        [frameworkComponents]="frameworkComponents"
        (gridReady)="onGridReady($event)"
      ></ag-grid-angular>
    </div>
  `
})
export class AppComponent {
  public columnDefs;
  public rowData;
  public frameworkComponents = { 'details': DetailsComponent };

  public constructor() {
    this.columnDefs = [
      {
        headerName: 'Row',
        field: 'row',
        cellRenderer: 'agGroupCellRenderer'
      },
      {
        headerName: 'X',
        field: 'value'
      }
    ];
    this.rowData = createRowData();
  }

  public onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }
}

function createRowData() {
  var rowData = [];
  for (var i = 0; i < 15; i++) {
    rowData.push({
      row: 'Row ' + i,
      value: i,
      currency: i + Number(Math.random().toFixed(2))
    });
  }
  return rowData;
}
