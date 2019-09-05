import { Component, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "my-app",
  template: `
    <ag-grid-angular
      #agGrid
      style="width: 100%; height: 100%;"
      id="myGrid"
      class="ag-theme-balham"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [debug]="true"
      [rowData]="rowData"
      (gridReady)="onGridReady($event)"
    ></ag-grid-angular>
  `
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  private columnDefs;
  private defaultColDef;
  private rowData: [];

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        children: [
          {
            headerName: "Athlete",
            field: "athlete",
            width: 150,
            filter: "agTextColumnFilter"
          },
          {
            headerName: "Age",
            field: "age",
            width: 90,
            filter: "agNumberColumnFilter"
          },
          {
            headerName: "Country",
            field: "country",
            width: 120
          }
        ]
      },
      {
        headerName: "Sports Results",
        children: [
          {
            headerName: "Sport",
            field: "sport",
            width: 110
          },
          {
            headerName: "Total",
            columnGroupShow: "closed",
            field: "total",
            width: 100,
            filter: "agNumberColumnFilter"
          },
          {
            headerName: "Gold",
            columnGroupShow: "open",
            field: "gold",
            width: 100,
            filter: "agNumberColumnFilter"
          },
          {
            headerName: "Silver",
            columnGroupShow: "open",
            field: "silver",
            width: 100,
            filter: "agNumberColumnFilter"
          },
          {
            headerName: "Bronze",
            columnGroupShow: "open",
            field: "bronze",
            width: 100,
            filter: "agNumberColumnFilter"
          }
        ]
      }
    ];
    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true
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
        this.rowData = data;
      });

      let colIdsToAdjust = ['athlete', 'age', 'country'];

        colIdsToAdjust.forEach(id => {
            let headerEl = document.querySelector(`[col-id=${id}]`);
            headerEl.classList.add('custom-header');
        });
  }
}
