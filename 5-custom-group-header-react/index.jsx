"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import flagRenderer from './flagRenderer.jsx'

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Country",
          field: "country",
          width: 120,
          rowGroup: true,
          hide: true,
        },
        {
          headerName: "Year",
          field: "year",
          width: 90,
          rowGroup: true,
          hide: true
        },
        {
          headerName: "Sport",
          field: "sport",
          width: 110
        },
        {
          headerName: "Athlete",
          field: "athlete",
          width: 200
        },
        {
          headerName: "Gold",
          field: "gold",
          width: 100
        }
      ],
      autoGroupColumnDef: {
        // headerName: 'By Country and Year',
        cellRendererParams: {
          innerRenderer: 'flagRenderer',
          suppressCount: true
        }
      },
      frameworkComponents: {
        flagRenderer: flagRenderer
      },
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
            autoGroupColumnDef={this.state.autoGroupColumnDef}
            frameworkComponents={this.state.frameworkComponents}
            animateRows={true}
            enableRangeSelection={true}
            enableSorting={true}
            enableFilter={true}
            onGridReady={this.onGridReady.bind(this)}
            rowData={this.state.rowData}

          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
