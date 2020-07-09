import React from "react";
import { AgGridReact } from "ag-grid-react";
import { render } from "react-dom";

import {
  GridOptions,
  Grid,
  GridApi,
  ColumnApi,
  GridReadyEvent,
  FirstDataRenderedEvent,
  IFilterParams,
} from "ag-grid-community";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import MyDateComponent from "./DateComponent";

import { Loggable, Athlete } from "./interfaces";

interface AppProps { }

interface AppState {
  rowData: Athlete[];
  gridOptions: GridOptions;
}

class App extends React.Component<AppProps, AppState> {
  public state: AppState;
  private gridApi: GridApi;
  private columnApi: ColumnApi;

  public constructor(props: AppProps) {
    super(props);
    this.state = {
      rowData: null,
      gridOptions: {
        columnDefs: [
          {
            field: "date",
            minWidth: 220,
            filter: "agDateColumnFilter",
            filterParams: {
              logger: () => console.log("paramater passed"),
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                var dateAsString = cellValue;
                var dateParts = dateAsString.split("/");
                var cellDate = new Date(
                  Number(dateParts[2]),
                  Number(dateParts[1]) - 1,
                  Number(dateParts[0])
                );
                if (
                  filterLocalDateAtMidnight.getTime() === cellDate.getTime()
                ) {
                  return 0;
                }
                if (cellDate < filterLocalDateAtMidnight) {
                  return -1;
                }
                if (cellDate > filterLocalDateAtMidnight) {
                  return 1;
                }
              }
            } as IFilterParams & Loggable
          },
          { field: "athlete" },
          { field: "country" },
          { field: "year" },
          { field: "sport" },
          { field: "total" }
        ],
        defaultColDef: {
          editable: true,
          sortable: true,
          flex: 1,
          minWidth: 100,
          filter: true,
          floatingFilter: true,
          resizable: true
        },
        frameworkComponents: {
          agDateInput: MyDateComponent
        }
      }
    };
  }

  private onGridReady = (params: GridReadyEvent): void => {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
    };

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        let data: Athlete[] = JSON.parse(httpRequest.responseText);
        updateData(data);
      }
    };
  };

  private onFirstDataRendered = (params: FirstDataRenderedEvent): void => {
    params.columnApi.autoSizeAllColumns();
  };

  public render(): React.ReactElement {
    let styles: React.CSSProperties = { width: "100%", height: "100vh" };
    return (
      <div
        className="ag-theme-alpine"
        style={styles}
      >
        <AgGridReact
          rowData={this.state.rowData}
          gridOptions={this.state.gridOptions}
          onGridReady={this.onGridReady}
          onFirstDataRendered={this.onFirstDataRendered}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
