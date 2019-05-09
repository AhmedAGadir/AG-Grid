import { Component, ViewChild } from "@angular/core";
import { MyCustomFilter } from "./my-custom-filter.component";

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
        [defaultColDef]="defaultColDef"
        [rowData]="rowData"
        [frameworkComponents]="frameworkComponents"
        (gridReady)="onGridReady($event)"
      ></ag-grid-angular>
    </div>
  `
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  private columnDefs;
  private defaultColDef;
  private rowData;
  private frameworkComponents;

  constructor() {
    this.columnDefs = [
      {
        headerName: "Row",
        field: "row",
      },
      {
        headerName: "Person A",
        field: "personA",
        filter: "myCustomFilter",
        menuTabs: ["filterMenuTab"]
      },
      {
        headerName: "Person B",
        field: "personB",
        filter: "myCustomFilter",
        menuTabs: ["filterMenuTab"]
      }
    ];
    this.defaultColDef = { filter: true };
    this.rowData = createRowData();
    this.frameworkComponents = { myCustomFilter: MyCustomFilter };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();
  }
}

function createRowData() {
  return [
    {
      row: "Row 1",
      personA: "Michael Phelps",
      personB: "Tina Wills"
    },
    {
      row: "Row 2",
      personA: "Michael Phelps",
      personB: "Aleksey Nemov"
    },
    {
      row: "Row 3",
      personA: "Aleksey Nemov",
      personB: "Tina Wills"
    }
  ];
}
