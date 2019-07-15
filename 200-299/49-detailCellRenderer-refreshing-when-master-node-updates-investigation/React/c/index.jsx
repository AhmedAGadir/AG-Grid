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
      detailCellRendererFramework: DetailCellRenderer,
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
        node.setExpanded(rowCount++ === 0);
      });
    }, 500);

    setInterval(this.incrementCalls.bind(this), 1000)
  };

  incrementCalls() {
    // METHOD 1) *** node.setRowData ((WORKS)) ***
    let firstNode = this.gridApi.getRowNode(177000);
    firstNode.setDataValue('calls', firstNode.data.calls + 1);

    // METHOD 2) ** transaction updates ((DOES NOT WORK)) ***
    // let firstNodeData = this.gridApi.getRowNode(177000).data
    // let updatedFirstNode = {
    //     ...firstNodeData,
    //     callRecords: firstNodeData.callRecords.map(record => ({...record})),
    //     calls: firstNodeData.calls + 1 
    // };
    // this.gridApi.updateRowData({update: [updatedFirstNode]});  

    // For method 3 see https://next.plnkr.co/edit/0KaaWYl25Zg25g0x 
  }

  getRowNodeId(data) {
    return data.account;
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
              detailCellRendererFramework={this.state.detailCellRendererFramework}
              onGridReady={this.onGridReady}
              rowData={this.state.rowData}
              enableCellChangeFlash={true}
              getRowNodeId={this.getRowNodeId}
            />
          </div>
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
