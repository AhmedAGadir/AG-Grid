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
          class="ag-theme-balham"
          [columnDefs]="columnDefs"
          (gridSizeChanged)="gridSizeChanged($event)"
          (gridReady)="onGridReady($event)"
          (dragStarted)="onDragStarted($event)"
          (dragStopped)="onDragStopped($event)"
        ></ag-grid-angular>
      </div>
    </div>
  `,
})
export class AppComponent {
  private gridApis = [];
  private columnApis = [];
  private rowData: any[];

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

  gridSizeChanged(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApis.push(params.api);
    this.columnApis.push(params.columnApi);
    params.api.sizeColumnsToFit();
  }

  onDragStarted (params) {
    if (!this.columnState) {
      this.columnState = params.columnApi.getColumnState();
    }
  }

  
  onDragStopped(params) {
    let newColumnState = params.columnApi.getColumnState();
    if (newColumnState.some((column, ind) => this.columnState[ind].colId !== column.colId)) {
        console.log('A column has been moved');
        this.columnState = newColumnState;
        // execute logic
        this.updateOtherColumnStates();
    } 
  }

  updateOtherColumnStates() {
    this.columnApis.forEach(columnApi => {
      columnApi.setColumnState(this.columnState.map(col => ({...col})));
    })
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
