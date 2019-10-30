// use getColumnState to achieve



import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <div *ngFor="let i of rowData">
      <h1>{{ i.event.athlete }}</h1>
      <div style="height: 100%; box-sizing: border-box;">
        <ag-grid-angular
          #agGrid
          style="width: 100%; height: 100%;"
          id="myGrid"
          [rowData]="i.tickets"
          [rowSelection]="rowSelection"
          class="ag-theme-balham"
          [columnDefs]="columnDefs"
          (gridSizeChanged)="gridSizeChanged($event)"
          (gridReady)="onGridReady($event)"
          (rowSelected)="onRowSelected($event)"
        ></ag-grid-angular>
      </div>
    </div>
  `,
})
export class AppComponent {
  private gridApis = [];
  private columnApis = [];
  private rowData: any[];

  rowSelection: any;
  private columnDefs;
  private rowData;

  constructor() {
    this.columnDefs = [
      {
        headerName: 'Row',
        field: 'row',
      },
      {
        headerName: 'Athlete',
        field: 'athlete',
      },
    ];
    this.rowData = createRowData();
    this.rowSelection = 'single';
  }

  onRowSelected(params) {
    if (this.updatingSelection) {
      return;
    }
    this.updatingSelection = true;
    this.mostRecentlySelectedGrid = params.api;
    this.clearOtherGrids()
    setTimeout(() => (this.updatingSelection = false), 0);
  }

  clearOtherGrids() {
   this.gridApis.forEach(gridApi => {
      let isMostRecentlySelected = gridApi === this.mostRecentlySelectedGrid;
      if (!isMostRecentlySelected) {
        gridApi.deselectAll();
        gridApi.clearFocusedCell();
      }
    });
  }

  gridSizeChanged(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApis.push(params.api);
    this.columnApis.push(params.columnApi);
    params.api.sizeColumnsToFit();
  }
}

function createRowData() {
  let data = [];
  for (let i = 1; i < 5; i++) {
    data.push({
      event: { athlete: 'Grid ' + i },
      tickets: [
        {
          row: 'Row 1',
          athlete: 'Michael Phelps',
        },
        {
          row: 'Row 2',
          athlete: 'Natalie Coughlin',
        },
        {
          row: 'Row 3',
          athlete: 'Michael Phelps',
        },
        {
          row: 'Row 4',
          athlete: 'Natalie Coughlin',
        },
      ],
    });
  }

  return data;
}
