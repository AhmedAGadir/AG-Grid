"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import DateCustomFilter from "./DateCustomFilter.jsx";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: 'athlete'
        },
        {
          headerName: "Date",
          field: "date",
          filter: 'dateCustomFilter',
          menuTabs: ["filterMenuTab"],
        }
      ],
      defaultColDef: {
        sortable: true,
      },
      rowData: this.generateRowData(),
      frameworkComponents: {
        dateCustomFilter: DateCustomFilter
      }
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  generateRowData() {
    let today = new Date();

    return [
      { athlete: 'Michael Phelps', date: today.toLocaleDateString() },
      { athlete: 'Natalie Coughlin', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toLocaleDateString() },
      { athlete: 'Aleksey Nemov', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toLocaleDateString() },
    ]
  }

  clearFilter() {
    this.gridApi.setFilterModel(null);
  }

  setFilter() {
    this.gridApi.setFilterModel({
      date: {
        today: false,
        yesterday: false,
        tomorrow: true
      }
    })
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ margin: '10px' }}>
          <button onClick={this.clearFilter.bind(this)} style={{ marginRight: '5px' }}>Clear Filter</button>
          <button onClick={this.setFilter.bind(this)}>Set Filter For Tomorrow</button>
        </div>
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
            onGridReady={this.onGridReady}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
