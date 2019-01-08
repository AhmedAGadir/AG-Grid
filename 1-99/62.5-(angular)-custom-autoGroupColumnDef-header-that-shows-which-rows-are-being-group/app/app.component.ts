import { Component, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CustomHeader } from "./custom-header.component";
import "ag-grid-enterprise";

@Component({
  selector: "my-app",
  template: `


<ag-grid-angular
    #agGrid
    style="width: 100%; height: 100%;"
    id="myGrid"
    [rowData]="rowData"
    class="ag-theme-balham"
    [columnDefs]="columnDefs"
    [enableFilter]="true"
    [enableSorting]="true"
    [sideBar]="true"
    [enableColResize]="true"
    [animateRows]="true"
    [frameworkComponents]="frameworkComponents"
    [autoGroupColumnDef]="autoGroupColumnDef"
    (gridReady)="onGridReady($event)"
    ></ag-grid-angular>


`
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;
  private rowData: any[];

  private columnDefs;
  private frameworkComponents;
  private autoGroupColumnDef;


  constructor(private http: HttpClient) {
    this.columnDefs = [
      { headerName: 'Country', field: 'country', width: 120, rowGroup: true, enableRowGroup: true },
      { headerName: 'Year', field: 'year', width: 90, rowGroup: true, enableRowGroup: true },
      { headerName: 'Sport', field: 'sport', width: 110, enableRowGroup: true },
      { headerName: 'Athlete', field: 'athlete', width: 200 },
      { headerName: 'Gold', field: 'gold', width: 100 },
      { headerName: 'Silver', field: 'silver', width: 100 },
      { headerName: 'Bronze', field: 'bronze', width: 100 },
      { headerName: 'Total', field: 'total', width: 100 },
      { headerName: 'Age', field: 'age', width: 90 },
      { headerName: 'Date', field: 'date', width: 110 },
    ];
    this.frameworkComponents = { 'customHeader': CustomHeader };
    this.autoGroupColumnDef = {
       headerComponent: 'customHeader',
       enablePivot: true,
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get(
        "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
      )
      .subscribe(data => {
        this.rowData = data;
      });
  }
}
