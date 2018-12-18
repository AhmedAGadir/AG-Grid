"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import CustomHeaderGroup from "./customHeaderGroup.jsx";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Athlete Details",
          children: [
            {
              headerName: "Athlete",
              field: "athlete",
              width: 150
            },
            {
              headerName: "Age",
              field: "age",
              width: 90,
              columnGroupShow: "open"
            },
            {
              headerName: "Country",
              field: "country",
              width: 120,
              columnGroupShow: "open"
            }
          ]
        },
        {
          headerName: "Medal details",
          children: [
            {
              headerName: "Year",
              field: "year",
              width: 90
            },
            {
              headerName: "Date",
              field: "date",
              width: 110
            },
            {
              headerName: "Sport",
              field: "sport",
              width: 110,
              columnGroupShow: "open"
            },
            {
              headerName: "Gold",
              field: "gold",
              width: 100,
              columnGroupShow: "open"
            },
            {
              headerName: "Silver",
              field: "silver",
              width: 100,
              columnGroupShow: "open"
            },
            {
              headerName: "Bronze",
              field: "bronze",
              width: 100,
              columnGroupShow: "open"
            },
            {
              headerName: "Total",
              field: "total",
              width: 100,
              columnGroupShow: "open"
            }
          ]
        }
      ],
      frameworkComponents: { agColumnGroupHeader: CustomHeaderGroup },
      defaultColDef: { width: 100 },
      rowData: []
    };
  }

  onGridReady(params) {
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
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
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
            frameworkComponents={this.state.frameworkComponents}
            enableColResize={true}
            defaultColDef={this.state.defaultColDef}
            onGridReady={this.onGridReady.bind(this)}
            rowData={this.state.rowData}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
