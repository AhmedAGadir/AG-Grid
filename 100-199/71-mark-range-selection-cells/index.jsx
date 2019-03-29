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
        cellStyle: params => {
          if (params.data.rangeSelection.includes(params.column.colId)) {
            return { backgroundColor: 'pink', textDecoration: 'line-through' };
          }
        }
      },
      rowData: null
    };
  }

  getRowNodeId(data) {
    return data.id;
  }

  onRangeSelectionChanged(params) {
    if (!params.finished) {
      return;
    }
    const { start, end, columns } = params.api.getRangeSelections()[0];
    if (start.rowIndex === end.rowIndex && columns.length === 1) {
      return;
    }
    const fieldsToSelect = columns.map(col => col.colId);
    let updatedRowData = this.state.rowData.map((row, ind) => ({
      ...row,
      rangeSelection: ind >= start.rowIndex && ind <= end.rowIndex ? [...new Set([...row.rangeSelection, ...fieldsToSelect])] : [...row.rangeSelection]
    }))

    this.setState({ rowData: updatedRowData });
    this.gridApi.refreshCells({ force: true });
  }

  onGridReady(params) {
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
        let idSequence = 0;
        let data = JSON.parse(httpRequest.responseText).map(row => ({
          ...row,
          rangeSelection: [],
          id: idSequence++
        }));
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
            deltaRowDataMode={true}
            getRowNodeId={this.getRowNodeId.bind(this)}
            onGridReady={this.onGridReady.bind(this)}
            onRangeSelectionChanged={this.onRangeSelectionChanged.bind(this)}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
