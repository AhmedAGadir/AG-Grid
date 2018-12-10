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
          headerName: "Group",
          field: "group"
        }
      ],
      defaultColDef: {
        enablePivot: true,
        enableRowGroup: true
      },
      statusBar: { items: [{ component: "agAggregationComponent" }] },
      rowSelection: "multiple",
      autoGroupColumnDef: {
        headerName: "Symbol",
        cellRenderer: "agGroupCellRenderer",
        field: "symbol"
      },
      groupDefaultExpanded: 1,
      getRowNodeId: function(data) {
        return data.symbol;
      },
      onGridReady: function(params) {
        immutableStore = [];
        immutableStore = getInitialData();
        params.api.setRowData(immutableStore);
        setGroupingEnabled(false, params.columnApi);
      }
    };
    this.filterToggle = false;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    immutableStore = [];
    immutableStore = getInitialData();
    params.api.setRowData(immutableStore);
    setGroupingEnabled(false, params.columnApi);
  }

  addFiveItems(append) {
    var newStore = immutableStore.slice();
    for (var i = 0; i < 5; i++) {
      var newItem = createItem();
      if (append) {
        newStore.push(newItem);
      } else {
        newStore.splice(0, 0, newItem);
      }
    }
    immutableStore = newStore;
    this.gridApi.setRowData(immutableStore);
  }
  removeSelected() {
    var selectedRowNodes = this.gridApi.getSelectedNodes();
    var selectedIds = selectedRowNodes.map(function(rowNode) {
      return rowNode.id;
    });
    immutableStore = immutableStore.filter(function(dataItem) {
      return selectedIds.indexOf(dataItem.symbol) < 0;
    });
    this.gridApi.setRowData(immutableStore);
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
  onGroupingEnabled(enabled) {
    setGroupingEnabled(enabled, this.gridColumnApi);
  }

  filterGroup() {
    this.filterToggle = !this.filterToggle;
    if (this.filterToggle) {
      this.gridApi.setFilterModel({group: ['C']})
    } else {
      this.gridApi.setFilterModel(null)
    }
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
              defaultColDef={this.state.defaultColDef}
              deltaRowDataMode={true}
              statusBar={this.state.statusBar}
              animateRows={true}
              enableColResize={true}
              rowSelection={this.state.rowSelection}
              enableRangeSelection={true}
              autoGroupColumnDef={this.state.autoGroupColumnDef}
              groupDefaultExpanded={this.state.groupDefaultExpanded}
              getRowNodeId={this.state.getRowNodeId}
              onGridReady={this.state.onGridReady}
              onGridReady={this.onGridReady.bind(this)}
              enableSorting={true}
              sideBar={true}

            />
          </div>
        </div>

        <div style={{ position: "absolute", top: "0", left: "0" }}>
          <button onClick={this.addFiveItems.bind(this, true)}>Append Items</button>
          <button onClick={this.addFiveItems.bind(this, false)}>Prepend Items</button>
          <button onClick={this.removeSelected.bind(this)}>Remove Selected</button>
          <button onClick={this.updatePrices.bind(this)}>Update Prices</button>

          <button id="groupingOn" onClick={this.onGroupingEnabled.bind(this, true)}>
            Grouping On
          </button>
          <button id="groupingOff" onClick={this.onGroupingEnabled.bind(this, false)}>
            Grouping Off
          </button>
          <button onClick={this.filterGroup.bind(this)}>
            Filter Group C
          </button>
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
  let groups = ['A','B','C']
  let groupInd = Math.floor(Math.random() * groups.length)
  var item = {
    group: groups[groupInd],
    symbol: createUniqueRandomSymbol(),
    price: Math.floor(Math.random() * 100)
  };
  return item;
}
function setGroupingEnabled(enabled, columnApi) {
  if (enabled) {
    columnApi.setRowGroupColumns(["group"]);
    columnApi.setColumnVisible("group", false);
    columnApi.setColumnVisible("symbol", false);
  } else {
    columnApi.setRowGroupColumns([]);
    columnApi.setColumnVisible("group", true);
    columnApi.setColumnVisible("symbol", true);
  }
  setItemVisible("groupingOn", !enabled);
  setItemVisible("groupingOff", enabled);
}
function setItemVisible(id, visible) {
  var element = document.querySelector("#" + id);
  element.style.display = visible ? null : "none";
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
