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
        { field: 'countries', enableRowGroup: true }
      ],
      defaultColDef: {
        width: 150,
      },
      rowData: [
        { countries: ['US', 'UK', 'Spain'] },
        { countries: ['US', 'Spain'] },
        { countries: ['Portugal'] }
      ]
    }

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onColumnRowGroupChanged(params) {
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", boxSizing: "border-box" }}>
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
              rowData={this.state.rowData}
              sideBar={true}
              rowGroupPanelShow='always'
              onColumnRowGroupChanged={this.onColumnRowGroupChanged.bind(this)}
              onGridReady={this.onGridReady.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}
render(<GridExample />, document.querySelector("#root"));
