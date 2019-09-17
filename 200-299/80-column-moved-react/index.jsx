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
          field: "athlete",
          width: 150
        },
        {
          field: "age",
          width: 90
        },
        {
          field: "country",
          width: 120
        },
        {
          field: "year",
          width: 90
        },
        {
          field: "date",
          width: 110
        },
        {
          field: "sport",
          width: 110
        },
        {
          field: "gold",
          width: 100
        },
        {
          field: "silver",
          width: 100
        },
        {
          field: "bronze",
          width: 100
        },
        {
          field: "total",
          width: 100
        }
      ],
      rowData: null,
      columnOrder: []
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
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };

    this.gridApi.addEventListener('columnMoveEnd', this.onColumnMoveEnd);
  };

  onDragStopped = params => {
    let newColumnOrder = params.columnApi.columnController.allDisplayedColumns.map(col => col.colDef.field);
    if (newColumnOrder.some((colId, ind) => this.state.columnOrder[ind] !== colId)) {
        // columnMoveEnd is a custom event 
        params.api.dispatchEvent({
            type: 'columnMoveEnd', 
            api: params.api, 
            columnApi: params.columnApi,
        });
        this.setState({columnOrder: newColumnOrder});
    } 
  }

  onColumnMoveEnd = params => {
    console.log('onColumnMoveEnd', params)
  }

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
            enableRangeSelection={true}
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}
            onDragStopped={this.onDragStopped}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
