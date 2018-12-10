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
        {
          headerName: "Athlete",
          field: "athlete"
        },
        {
          headerName: "Sport",
          field: "sport"
        },
        {
          headerName: "Age",
          field: "age",
        },
        {
          headerName: "Year",
          field: "year",
        },
        {
          headerName: "Date",
          field: "date",
          width: 200
        }
      ],
      defaultColDef: {
        width: 150,
      },
      getRowHeight: params => {
        if (params.node.data.sport === 'Gymnastics') {
          return 75
        } 
        return 25
      },
      rowData: []
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
    };

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", boxSizing: "border-box" }}>
          <div
            id="myGrid"
            style={{
              boxSizing: "border-box",
              height: "100%",
              width: "100%"
            }}
            className="ag-theme-balham"
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              defaultColGroupDef={this.state.defaultColGroupDef}
              columnTypes={this.state.columnTypes}
              onGridReady={this.onGridReady.bind(this)}
              rowData={this.state.rowData}
              getRowHeight={this.state.getRowHeight}
            />
          </div>
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
