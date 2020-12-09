// src/app/my-grid-application/my-grid-application.component.ts
import { Component } from "@angular/core";
import { GridOptions, GridApi } from "ag-grid-community";
import * as _ from "lodash";
import { HeaderComponent } from "../header/header.component";
import "ag-grid-enterprise";

@Component({
  selector: "app-my-grid-application",
  templateUrl: "./my-grid-application.component.html",
  styleUrls: ["./my-grid-application.component.css"]
})

export class MyGridApplicationComponent {
  private gridOptions: GridOptions;
  private gridApi: GridApi;
  private rowSettings;
  private colSettings = {};
  private headerSettings;

  constructor() {
    this.gridOptions = <GridOptions>{
      context: {},
      onModelUpdated: () => {
        this.gridApi && this.gridApi.sizeColumnsToFit();
      }
    };
    this.gridOptions.autoGroupColumnDef = {
      headerName: "DummyHeader",
      headerClass: "empty-column-group",

      // headerGroupComponentFramework: HeaderComponent,

      // children: [
      //   {
      //     headerName: "Test",
      //     field: "id",
      //     headerComponentFramework: HeaderComponent
      //   }
      // ]

      headerComponentFramework: HeaderComponent
    };
    this.gridOptions.columnDefs = [
      {
        headerName: "ID",
        field: "id",
        rowGroup: true,
        hide: true,
        headerComponentFramework: HeaderComponent
      },
      {
        headerName: "",
        headerClass: "empty-column-group",
        headerGroupComponentFramework: HeaderComponent,
        children: [
          {
            headerName: "Value-Start",
            field: "value",
            headerComponentFramework: HeaderComponent
          }
        ]
      },
      {
        headerName: "Value",
        headerGroupComponentFramework: HeaderComponent,
        children: [
          {
            headerName: "Value-1",
            field: "value",
            headerComponentFramework: HeaderComponent
          },
          {
            headerName: "Value-2",
            field: "value",
            headerComponentFramework: HeaderComponent
          }
        ]
      }
    ];
    this.gridOptions.rowData = [
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 },
      { id: 5, value: 10 },
      { id: 10, value: 15 },
      { id: 15, value: 20 }
    ];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onHeaderSettingsApply(headerSettings) {
    this.headerSettings = _.cloneDeep(headerSettings);
    this.gridOptions.context.headerSettings = this.headerSettings;
    this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
  }

  onClearHeaderSettings() {
    this.headerSettings = null;
    this.gridOptions.context.headerSettings = this.headerSettings;
    this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
  }
}
