"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { field: "athlete", width: 150 },
        { field: "age", width: 90 },
        { field: "country", width: 120 },
        { field: "year", width: 90 },
        { field: "date", width: 110 },
        { field: "sport", width: 110 },
        { field: "gold", width: 100 },
        { field: "silver", width: 100 },
        { field: "bronze", width: 100 },
        { field: "total", width: 100 }
      ],
      defaultColDef: {
        valueGetter: params => params.data[params.column.colId].val,
        cellStyle: params => {
          if (params.value.highlighted) {
            return { backgroundColor: 'pink', 'text-decoration': 'line-through' };
          }
        }


      },
      rowData: null
    };
  }

  onRangeSelectionChanged(params) {
    console.log(params)
    console.log(params.started, params.finished)
    if (params.started && params.finished) {
      debugger;

    }
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        let data = JSON.parse(httpRequest.responseText).map(row => {
          let updatedRow = {}
          Object.keys(row).forEach(field => {
            updatedRow[field] = {
              val: row[field],

              highlighted: false
            }
          });
          return updatedRow
        });
        console.log(data);
        this.setState({ rowData: data });
      }
    };
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          id="myGrid"
          style={{
            height: "100%",
            width: "100%"
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            enableRangeSelection={true}
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}
            onRangeSelectionChanged={this.onRangeSelectionChanged}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
