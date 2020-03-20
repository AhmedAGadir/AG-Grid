import { Component, ViewChild } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";

import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { saveRows, replaceRow } from "./app.actions";

@Component({
  selector: "app-root",
  template: `
    <h3>Rows in Store:</h3>
    <span *ngFor="let row of rowData$ | async">
      {{ row.athlete }},  
    </span>

    <h3>My Grid</h3>
    <div style="height: 80vh; box-sizing: border-box;">
      <ag-grid-angular
        #agGrid
        style="width: 100%; height: 100%;"
        id="myGrid"
        class="ag-theme-balham"
        [modules]="modules"
        [columnDefs]="columnDefs"
        [defaultColDef]="defaultColDef"
        [rowModelType]="rowModelType"
        [cacheBlockSize]="cacheBlockSize"
        [maxBlocksInCache]="maxBlocksInCache"
        [animateRows]="true"
        [rowData]="rowData"
        (gridReady)="onGridReady($event)"
        (cellEditingStopped)="onCellEditingStopped($event)"
      ></ag-grid-angular>
    </div>
  `
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;
  public modules: Module[] = AllModules;

  private columnDefs;
  private defaultColDef;
  private rowModelType;
  private cacheBlockSize;
  private maxBlocksInCache;
  private rowData: [];

  rowData$: Observable<any>;

  constructor(
    private http: HttpClient,
    private store: Store<{ rows: any }>
  ) {
    this.columnDefs = [
      { field: "id" },
      {
        field: "athlete",
        width: 150
      },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "sport" },

      { field: "gold" },
      { field: "silver" },
      { field: "bronze" }
    ];
    this.defaultColDef = {
      width: 120,
      resizable: true,
      editable: true,
    };
    this.rowModelType = "serverSide";
    this.cacheBlockSize = 100;
    this.maxBlocksInCache = 10;

    this.rowData$ = store.select(state => state.rows.rows);

    this.addRowsToStore = this.addRowsToStore.bind(this);
    this.replaceRowInStore = this.replaceRowInStore.bind(this);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get(
        "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json"
      )
      .subscribe(data => {
        var idSequence = 0;
        data.forEach(function(item) {
          item.id = idSequence++;
        });
        var server = new FakeServer(data);
        var datasource = new ServerSideDatasource(server, this.addRowsToStore, this.replaceRowInStore);
        params.api.setServerSideDatasource(datasource);
      });
  }

  onCellEditingStopped(params) {
    this.gridApi.serverSideRowModel.datasource.updateRow({
      id: params.node.id,
      field: params.column.colId,
      value: params.value
    });
    this.gridApi.purgeServerSideCache();
  }

  addRowsToStore(rows) {
    this.store.dispatch(saveRows({rows}));
  }

  replaceRowInStore(params) {
    this.store.dispatch(replaceRow(params));
  }

}

function ServerSideDatasource(server, addRowsToStore, replaceRowInStore) {
  return {
    updatingRow: null,
    getRows: (params) => {
      setTimeout(() => {
        var response = server.getResponse(params.request);
        if (response.success) {
          if (this.updatingRow) {
            replaceRowInStore(this.updatingRow);
            this.updatingRow = null;
          } else {
            addRowsToStore(response.rows);
          }
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 500);
    },
    updateRow: (params) => {
      this.updatingRow = params;
      server.updateRow(params);
    }
  };
}

function FakeServer(allData) {
  return {
    getResponse: function(request) {
      console.log(
        "asking for rows: " + request.startRow + " to " + request.endRow
      );
      var rowsThisPage = allData.slice(request.startRow, request.endRow);
      var lastRow = allData.length <= request.endRow ? data.length : -1;
      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow
      };
    },
    updateRow({id, field, value}) {
      let rowInd = allData.findIndex(row => row.id == id);
      allData[rowInd][field] = value;
    }
  };
}
