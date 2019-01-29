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
          headerName: "Country",
          field: "country",
          rowGroup: true,
          enableRowGroup: true,
          enablePivot: true,
        },
        {
          headerName: "Year",
          field: "year",
          rowGroup: true,
          enableRowGroup: true,
          enablePivot: true,
        },
        {
          headerName: "Sport",
          field: "sport",
          enableRowGroup: true,
          enablePivot: true
        },
        {
          headerName: "Gold",
          field: "gold",
          enableValue: true,
          aggFunc: "sum",
          cellRenderer: 'agAnimateShowChangeCellRenderer',
          enableCellChangeFlash: true,

        },
        {
          headerName: "Silver",
          field: "silver",
          enableValue: true,
          aggFunc: "sum",
          cellRenderer: 'agAnimateShowChangeCellRenderer',
          enableCellChangeFlash: true
        },
        {
          headerName: "Bronze",
          field: "bronze",
          enableValue: true,
          aggFunc: "sum",
          cellRenderer: 'agAnimateShowChangeCellRenderer',
          enableCellChangeFlash: true
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true
      },
      rowData: null,
      getRowNodeId: function (data) {
        return data.id;
      }
    };
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
        let rowData = JSON.parse(httpRequest.responseText).map((row, ind) => ({
          ...row,
          id: ind
        }))
        this.setState({ rowData: rowData });
      }
    };
  };

  createItem(rows) {
    var randInd = Math.floor(Math.random() * rows.length);
    var randRowCopy = {
      ...rows[randInd],
      id: rows.length
    }
    return randRowCopy;
  }

  addFiveItems(append) {
    var updatedRows = this.state.rowData.map(row => ({ ...row }));
    for (var i = 0; i < 5; i++) {
      var newItem = this.createItem(updatedRows);
      if (append) {
        updatedRows.push(newItem);
      } else {
        updatedRows.splice(0, 0, newItem);
      }
    }
    this.setState({ rowData: updatedRows })
  }

  reverseItems() {
    var updatedRows = this.state.rowData
      .map(row => ({ ...row }))
      .reverse();
    this.setState({ rowData: updatedRows });
  }

  removeSelected() {
    var selectedIds = this.gridApi
      .getSelectedNodes()
      .map(function (rowNode) {
        return rowNode.id;
      });
    var updatedRows = this.state.rowData
      .map(row => ({ ...row }))
      .filter(function (row) {
        return selectedIds.indexOf(row.id) < 0;
      });
    this.setState({ rowData: updatedRows })
  }

  updateMedals() {
    var updatedRows = this.state.rowData
      .map(row => ({
        ...row,
        gold: Math.random() < 0.5 ? row.gold + 1 : row.gold,
        // silver: Math.random() < 0.5 ? row.silver + 1 : row.silver,
        bronze: Math.random() < 0.5 ? row.bronze + 1 : row.bronze,
      }));
    this.setState({ rowData: updatedRows })
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
              defaultColDef={this.state.defaultColDef}
              rowData={this.state.rowData}
              sideBar={true}
              pivotMode={true}
              deltaRowDataMode={true}
              animateRows={true}
              rowSelection='multiple'
              getRowNodeId={this.state.getRowNodeId}
              onGridReady={this.onGridReady}
            />
          </div>
        </div>

        <div style={{ position: "absolute", top: "0", left: "0" }}>
          <button onClick={this.addFiveItems.bind(this, true)}>Append Items</button>
          <button onClick={this.addFiveItems.bind(this, false)}>Prepend Items</button>
          <button onClick={this.reverseItems.bind(this)}>Reverse</button>
          <button onClick={this.removeSelected.bind(this)}>Remove Selected</button>
          <button onClick={this.updateMedals.bind(this)}>Update Medals</button>
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
