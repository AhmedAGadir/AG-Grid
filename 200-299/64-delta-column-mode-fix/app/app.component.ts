import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';

@Component({
  selector: 'my-app',
  template: `
    <div style="height: 100%; padding-top: 26px; box-sizing: border-box;">
      <button (click)="addColumn()">
        Add column
      </button>
      <button (click)="saveColumnDefs()">
        Save column denfinition
      </button>
      <button (click)="restoreColumnDefs()">
        Restore column definitions
      </button>
      <ag-grid-angular
        #agGrid
        style="width: 100%; height: 300px;"
        id="myGrid"
        class="ag-theme-balham"
        [columnDefs]="columnDefs"
        [animateRows]="true"
        [rowData]="rowData"
        [sideBar]="true"
        [deltaColumnMode]="true"
        (gridReady)="onGridReady($event)"
        (columnVisible)="onColumnVisible($event)"
      ></ag-grid-angular>
    </div>
  `,
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  private columnDefs;
  private defaultColDef;
  private cacheBlockSize;
  private maxBlocksInCache;
  private rowData: [];
  private savedColumnDefs;
  private restoringState = false;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: 'column 1',
        field: 'column 1',
        colId: 'col1',
        hide: false,
      },
      {
        headerName: 'column 2',
        field: 'column 2',
        colId: 'col2',
        hide: false,
      },
      {
        headerName: 'column 3',
        field: 'column 3',
        colId: 'col3',
        hide: false,
      },
    ];

    this.rowData = [
      {
        'column 1': 'row1 col 1',
        'column 2': 'row1 col 2',
        'column 3': 'row1 col 3',
      },
      {
        'column 1': 'row2 col 1',
        'column 2': 'row2 col 2',
        'column 3': 'row2 col 3',
      },
      {
        'column 1': 'row2 col 1',
        'column 2': 'row2 col 2',
        'column 3': 'row2 col 3',
      },
    ];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  saveColumnDefs() {
    this.savedColumnDefs = this.columnDefs.map(col => ({...col}));
  }

  restoreColumnDefs() {
    this.restoringState = true;
    this.columnDefs = this.savedColumnDefs.map(col => ({...col}))
    this.gridApi.setColumnDefs(this.columnDefs);
    setTimeout(() => this.restoringState = false, 0);
  }

  addColumn() {
    const id = Object.keys(this.columnDefs).length + 1;
    var newColumn = {
        headerName: `[added] column ${id}`,
        field: `column ${id}`,
        colId: `col${id}`,
        hide: false
      };
    this.columnDefs = [
      ...this.columnDefs,
      newColumn
    ];
    console.log('added columns, new columndefs are', this.columnDefs);
    this.savedColumnDefs.push({...newColumn, hide: true});
  }

  onColumnVisible(params) {
    if (this.restoringState) {
      return;
    }
    this.columnDefs = this.columnDefs.map(col => {
      if (col.colId === params.column.colId) {
        return { ...col, hide: !params.column.visible };
      } else {
        return { ...col };
      }
    });
  }
}
