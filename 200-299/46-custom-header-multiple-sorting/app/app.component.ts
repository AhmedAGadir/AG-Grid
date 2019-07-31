import { Component, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CustomHeader } from "./custom-header.component";

@Component({
  selector: "my-app",
  template: `
    <ag-grid-angular
      #agGrid
      style="width: 100%; height: 100%;"
      id="myGrid"
      class="ag-theme-balham"
      [columnDefs]="columnDefs"
      [rowData]="rowData"
      [suppressMenuHide]="true"
      [frameworkComponents]="frameworkComponents"
      [defaultColDef]="defaultColDef"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
  `
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  private columnDefs;
  private frameworkComponents;
  private defaultColDef;
  private rowData: [];

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: "Gold",
        field: "gold",
        width: 115,
        headerComponentParams: { menuIcon: "fa-cog" },
        comparator: (valA, valB, nodeA, nodeB, isInverted) => {
          let sortStates = nodeA.gridApi.gridPanel.headerRootComp.childContainers[0].headerRowComps[0].headerComps.gold.childComponents[1]._agAwareComponent.sortStates;

          let currentSort = Object.keys(sortStates).find(key => sortStates[key]);

          switch (currentSort) {
            case 'asc':
              return valB - valA;
            case 'asc_abs':
              return Math.abs(valB) - Math.abs(valA);
            case 'desc':
              return valA - valB
            case 'desc_abs':
              return Math.abs(valA) - Math.abs(valB)
            case 'none':
              return 0;
          }
        }
      }
    ];
    this.frameworkComponents = { agColumnHeader: CustomHeader };
    this.defaultColDef = {
      width: 100,
      headerComponentParams: { menuIcon: "fa-bars" },
      sortable: true,
      resizable: true,
      filter: true,
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get(
        "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
      )
      .subscribe(data => {
        data = data.slice(0, 20).map(row => ({
          ...row,
          gold: Math.random() < 0.3 ? row.gold : -row.gold
        }));
        this.rowData = data;
      });
  }
}
