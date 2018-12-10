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
          headerName: "Symbol",
          field: "symbol"
        },
        {
          headerName: "Price",
          field: "price",
          cellRenderer: 'agAnimateShowChangeCellRenderer'
        }
      ],
      autoGroupColumnDef: {
        headerName: "Symbol",
        cellRenderer: "agGroupCellRenderer",
        field: "symbol"
      },
      getRowNodeId: function(data) {
        return data.symbol;
      },
      onGridReady: function(params) {
        immutableStore = [];
        immutableStore = getInitialData();
        params.api.setRowData(immutableStore);
      }
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    immutableStore = [];
    immutableStore = getInitialData();
    params.api.setRowData(immutableStore);
  }

  updatePrices() {
    var newStore = [];
    immutableStore.forEach(function(item) {
      newStore.push({
        symbol: item.symbol,
        group: item.group,
        price: Math.floor(Math.random() * 100)
      });
    });
    immutableStore = newStore;
    this.gridApi.setRowData(immutableStore);
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", paddingTop: "35px", boxSizing: "border-box" }}>
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
              deltaRowDataMode={true}
              statusBar={this.state.statusBar}
              animateRows={true}
              enableColResize={true}
              rowSelection={this.state.rowSelection}
              enableRangeSelection={true}
              autoGroupColumnDef={this.state.autoGroupColumnDef}
              groupDefaultExpanded={this.state.groupDefaultExpanded}
              enableSorting={true}
              getRowNodeId={this.state.getRowNodeId}
              onGridReady={this.state.onGridReady}
              onGridReady={this.onGridReady.bind(this)}
            />
          </div>
        </div>

        <div style={{ position: "absolute", top: "0", left: "0" }}>
          <button onClick={this.updatePrices.bind(this)}>Update Prices</button>
          <span style={{ padding: "10px" }} />
        </div>
      </div>
    );
  }
}

function getInitialData() {
  var data = [];
  for (var i = 0; i < 10; i++) {
    data.push(createItem());
  }
  return data;
}
var immutableStore;
function filter(list, callback) {
  var filteredList = [];
  list.forEach(function(item) {
    if (callback(item)) {
      filteredList.push(item);
    }
  });
  return filteredList;
}
function createItem() {
  var item = {
    symbol: createUniqueRandomSymbol(),
    price: Math.floor(Math.random() * 100)
  };
  return item;
}

function createUniqueRandomSymbol() {
  var symbol;
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var isUnique = false;
  while (!isUnique) {
    symbol = "";
    for (var i = 0; i < 3; i++) {
      symbol += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    isUnique = true;
    immutableStore.forEach(function(oldItem) {
      if (oldItem.symbol === symbol) {
        isUnique = false;
      }
    });
  }
  return symbol;
}

render(<GridExample />, document.querySelector("#root"));
