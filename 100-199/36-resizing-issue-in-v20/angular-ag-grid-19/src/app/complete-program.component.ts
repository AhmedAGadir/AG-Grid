import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { GridOptions, GridApi } from 'ag-grid-community';
import 'ag-grid-enterprise';

@Component({
  selector: 'app-complete-program',
  template: `
            <div class="lwe-grid-wrapper">
              <ag-grid-angular style="width: 100%; height: 450px;"
                #dt
                id="grid-complete-program"
                [rowData]="rowData"
                class="ag-theme-balham"
                [columnDefs]="columnDefs"
                [gridOptions]="gridOptions"
                [groupSuppressAutoColumn]="false"
                [groupUseEntireRow]="true"
                [toolPanelSuppressSideButtons]="true"
                (gridReady)="onGridReady($event)"
                (gridSizeChanged)="onGridSizeChanged($event)"
              ></ag-grid-angular>
            </div>
            `
})
export class CompleteProgramComponent implements OnInit {
  gridApi;
  gridColumnApi;
  columnDefs;
  gridOptions: GridOptions;
  rowData: any;
  defaultColDef;

  colTitle1: string;
  colTitle2: string;
  colTitle3: string;
  colTitle4: string;
  colTitle5: string;
  colTitle6: string;

  constructor(private http: HttpClient
  ) { 
        this.columnDefs = [
      {
        headerName: "Athlete",
        field: "athlete",
        width: 150,
        suppressSizeToFit: true
      },
      {
        headerName: "Age",
        field: "age",
        width: 90,
        minWidth: 50,
        maxWidth: 100
      },
      {
        headerName: "Country",
        field: "country",
        width: 120
      },
      {
        headerName: "Year",
        field: "year",
        width: 90
      },
      {
        headerName: "Date",
        field: "date",
        width: 110
      },
      {
        headerName: "Sport",
        field: "sport",
        width: 110
      },
      {
        headerName: "Gold",
        field: "gold",
        width: 100
      },
      {
        headerName: "Silver",
        field: "silver",
        width: 100
      },
      {
        headerName: "Bronze",
        field: "bronze",
        width: 100
      },
      {
        headerName: "Total",
        field: "total",
        width: 100
      }
    ];
    this.defaultColDef = { resizable: true };
   }

  ngOnInit() {
    this.gridOptions = <GridOptions>{
      suppressCellSelection: true,
      suppressHorizontalScroll: true
    };
  }

  onGridSizeChanged(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
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
