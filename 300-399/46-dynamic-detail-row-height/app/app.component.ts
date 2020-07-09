import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { DetailCellRenderer } from './detail-cell-renderer.component';

@Component({
  selector: 'my-app',
  template: `
  <div>
    <button (click)="updateData()">Update Data</button>
    <ag-grid-angular
      #agGrid
      style="width: 100%; height: 95vh;"
      id="myGrid"
      class="ag-theme-alpine"
      [masterDetail]="true"
      [detailCellRenderer]="detailCellRenderer"
      [frameworkComponents]="frameworkComponents"
      [columnDefs]="columnDefs"
      [defaultColDef]="defaultColDef"
      [rowData]="rowData"
      (firstDataRendered)="onFirstDataRendered($event)"
      (gridReady)="onGridReady($event)"
      [immutableData]="true"
      [getRowNodeId]="getRowNodeId"
      [getRowHeight]="getRowHeight"
      (rowDataUpdated)="onRowDataUpdated($event)"
    ></ag-grid-angular>
    </div>
  `,
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  private detailCellRenderer;
  private frameworkComponents;
  private columnDefs;
  private defaultColDef;
  private rowData: [];

  private fruit: string[];

  constructor(private http: HttpClient) {
    this.detailCellRenderer = 'myDetailCellRenderer';
    this.frameworkComponents = { myDetailCellRenderer: DetailCellRenderer };
    this.columnDefs = [
      {
        field: 'name',
        cellRenderer: 'agGroupCellRenderer',
      },
      { field: 'account' },
      { field: 'calls' },
      {
        field: 'minutes',
        valueFormatter: "x.toLocaleString() + 'm'",
      },
    ];
    this.defaultColDef = { flex: 1 };
  }

  updateData() {
    this.fruit = [...this.fruit, 'raspberries'];
    let updatedRows = this.rowData.map(row => ({
      ...row,
      fruit: [...this.fruit]
    }));
    this.gridApi.applyTransaction({update: updatedRows});
  }

  onFirstDataRendered(params) {
    params.api.forEachNode(function(node) {
      node.setExpanded(node.id === '177001');
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get(
        'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/custom-detail-with-form/data/data.json'
      )
      .subscribe(data => {
        this.fruit = [
        'apples',
        'oranges',
        'bananas',
        'pears'
      ];
      data.forEach(d => {
        d.fruit = [...this.fruit];
      });

        this.rowData = data;
      });
  }

  getRowNodeId = data => data.account.toString();

  getRowHeight = params => {
    if (params.node.master) {
      return 41;
    }
    let cellPadding = 20;
    let h1Height = 33;
    let data = params.data.fruit.length * 17
    return cellPadding + h1Height + data;
  }

  onRowDataUpdated = () => {
    this.gridApi.resetRowHeights();
  }
}
