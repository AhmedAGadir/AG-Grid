import { Component, ViewChild } from "@angular/core";
import "ag-grid-enterprise";
import { GridOptions } from "ag-grid-community";

@Component({
  selector: "my-app",
  template: `
  <button (click)="addNewLine()">Add New Line</button>
<div *ngFor="let i of rowData">
  <h1>{{i.event.name}}</h1>
  <div style="height: 100%; box-sizing: border-box;">
      <ag-grid-angular
      #agGrid
      style="width: 100%; height: 100%;"
      id="myGrid"
      [rowData]="i.tickets"
      [gridOptions]="gridOptions"
      [animateRows]="true"

      class="ag-theme-balham"
      [columnDefs]="columnDefs"
      (gridSizeChanged)="gridSizeChanged($event)"
      (gridReady)="onGridReady($event)"
      ></ag-grid-angular>
  </div>
</div>
`
})
export class AppComponent {
  private gridApis = [];
  private rowData: any[];
  gridOptions: any;
  private columnDefs;
  private rowData;
  private frameworkComponents;
  private counter;

  constructor() {
    this.counter = 0;
    this.gridOptions = <GridOptions>{
      context: {
        gridParent: this
      },
      getContextMenuItems: this.getContextMenuFunc()
    };
    this.columnDefs = [
      {
        headerName: "Row",
        field: "row",
        width: 450
      },
      {
        headerName: "Filter Component",
        field: "name",
        width: 430,
        menuTabs: ["filterMenuTab"]
      },
    ];
    this.rowData = createRowData();
  }

  // GetContextMenu() {
  //   this.contextMenuItems = function getContextMenuItems(params: any) {
  //     console.log(params.api.gridPanel.eCenterViewport)
  //     params.context.gridParent.gridApis.forEach(gridApi => console.log(gridApi === params.api));
  //     let result;

  //     result = [
  //       { name: "Copy", action: function () { params.context.gridParent.CopyAndPateRowIntoGrid(params) } },
  //       { name: "Delete", action: function () { params.context.gridParent.RemoveRowFromGrid(params) } },
  //     ];

  //     return result;
  //   };
  // }

  getContextMenuFunc() {
    console.log('this should be executed 3 times on loading')
    return (params: any) => {
      params.context.gridParent.gridApis.forEach(gridApi => console.log(gridApi === params.api));
      let result;

      result = [
        { name: "Copy", action: function () { params.context.gridParent.CopyAndPateRowIntoGrid(params) } },
        { name: "Delete", action: function () { params.context.gridParent.RemoveRowFromGrid(params) } },
      ];

      return result;
    }
  }


  RemoveRowFromGrid(params: any) {
    let data = [];
    data.push(params.node.data);
    // this.gridApi.updateRowData({ remove: data });
    this.gridApis.forEach((gridApi, ind) => {
      if (params.api === gridApi) {
        gridApi.updateRowData({ remove: data });
      }
    })
  }

  CopyAndPateRowIntoGrid(params: any) {
    let data = CreateNewRowData(params.node.data);
    // this.gridApi.updateRowData({ add: [data] });
    this.gridApis.forEach(gridApi => {
      if (params.api === gridApi) {
        gridApi.updateRowData({ add: [data] });
      }
    })
  }

  gridSizeChanged(params: any) {
    params.api.sizeColumnsToFit();
  }

  gridApi: any;
  onGridReady(params) {
    this.gridApis.push(params.api);
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  addNewLine() {
    let data = { row: "Row " + this.counter, name: "Michael Phelps" }
    let newdata = CreateNewRowData(data);

    this.gridApis.forEach(gridApi => {
      gridApi.updateRowData({ add: [newdata] });
      gridApi.redrawRows();
    });

    this.counter++
  }
}

function createRowData() {
  let data = [];
  for (let i = 1; i < 4; i++) {
    data.push({
      event: { name: i + ' Grid' },
      tickets: [],
    });
  }

  return data;
}

function CreateNewRowData(rowData: any) {
  var row = {
    row: rowData.row,
    name: rowData.name,
  };

  return row;
}
