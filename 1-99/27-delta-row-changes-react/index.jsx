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
          field: "price"
        },
        {
          headerName: "Action",
          field: "action",
          cellRenderer: 'editButton',
        }
      ],
      getRowNodeId: function(data) {
        return data.symbol;
      },
      onGridReady: function(params) {
        immutableStore = [];
        immutableStore = getInitialData();
        params.api.setRowData(immutableStore);
      },
      frameworkComponents: {
        editButton: this.editButton
      }
    };
  }

  editButton = params => {
    let id = params.data.symbol
    return <button onClick={() => this.logNewPrice(id)}>Edit</button>
  }

  logNewPrice = id => {
    console.log(this.gridApi.getRowNode(id).data.price)
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
        price: Math.floor(Math.random() * 100)
      });
    });
    immutableStore = newStore;
    this.gridApi.setRowData(immutableStore);
  }


  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
                <button onClick={this.updatePrices.bind(this)}>Update Prices</button>
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
              deltaRowDataMode={true}
              animateRows={true}
              enableColResize={true}
              enableRangeSelection={true}
              enableSorting={true}
              getRowNodeId={this.state.getRowNodeId}
              onGridReady={this.state.onGridReady}
              onGridReady={this.onGridReady.bind(this)}
              frameworkComponents={this.state.frameworkComponents}
            />
          </div>
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
