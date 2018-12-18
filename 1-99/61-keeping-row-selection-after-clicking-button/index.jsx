"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import ChildMessageRenderer from "./childMessageRenderer.jsx";
import CustomHeaderComponent from './CustomHeaderComponent.jsx';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Row",
          field: "row",
          width: 150
        },
        {
          headerName: "Child/Parent",
          headerComponentFramework: CustomHeaderComponent,
          field: "value",
          cellRenderer: "childMessageRenderer",
          colId: "params",
          width: 180
        }
      ],
      rowData: createRowData(),
      context: { componentParent: this },
      frameworkComponents: {
        childMessageRenderer: ChildMessageRenderer
      },
      selectedNodes: []
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onSelectionChanged(params) {
    // keep a log of the selected nodes before clicking the button
    this.setState({
      selectedNodes: params.api.getSelectedNodes()
    })
  }

  methodFromParent(cell, node) {
    alert("Parent Component Method from " + cell + "!");
    // unselect the current node
    node.setSelected(false)
    // reach into the log of selected nodes and reselect each one
    this.state.selectedNodes.forEach(node => node.setSelected(true));
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
              rowSelection={'multiple'}
              rowData={this.state.rowData}
              context={this.state.context}
              frameworkComponents={this.state.frameworkComponents}
              onGridReady={this.onGridReady.bind(this)}
              onSelectionChanged={this.onSelectionChanged.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }

}

function createRowData() {
  var rowData = [];
  for (var i = 0; i < 15; i++) {
    rowData.push({
      row: "Row " + i,
      value: i,
    });
  }
  return rowData;
}

render(<GridExample />, document.querySelector("#root"));
