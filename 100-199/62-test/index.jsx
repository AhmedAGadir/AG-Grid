"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import DetailCellRenderer from "./detailCellRenderer.jsx";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: "name",
          cellRenderer: "agGroupCellRenderer"
        },
        { field: "account" },
        { field: "calls" },
        {
          field: "minutes",
          valueFormatter: "x.toLocaleString() + 'm'"
        }
      ],
      detailRowHeight: 260,
      detailCellRenderer: "myDetailCellRenderer",
      frameworkComponents: { myDetailCellRenderer: DetailCellRenderer },
      rowData: []
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
    };

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/custom-detail-with-grid/data/data.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };

    setTimeout(function() {
      var rowCount = 0;
      params.api.forEachNode(function(node) {
        node.setExpanded(rowCount++ === 1);
      });
    }, 500);
  };

  printDetailGridInfo() {
    console.log("Currently registered detail grid's: ");
    this.gridApi.forEachDetailGridInfo(function(detailGridInfo) {
      console.log(detailGridInfo);
    });
  }
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", paddingTop: "35px", boxSizing: "border-box" }}>
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
              masterDetail={true}
              detailRowHeight={this.state.detailRowHeight}
              detailCellRenderer={this.state.detailCellRenderer}
              frameworkComponents={this.state.frameworkComponents}
              onGridReady={this.onGridReady}
              rowData={this.state.rowData}
            />
          </div>
        </div>

        <div style={{ position: "absolute", top: "0px", left: "0px" }}>
          <button onClick={this.printDetailGridInfo.bind(this)}>Print Detail Grid Info</button>
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
