"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import GroupRowInnerRenderer from "./groupRowInnerRenderer.jsx";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Athlete",
          field: "athlete",
          width: 150
        },
        {
          headerName: "Age",
          field: "age",
          width: 90
        },
        {
          headerName: "Gold",
          field: "gold",
          width: 100,
          type: "number"
        },
        {
          headerName: "Silver",
          field: "silver",
          width: 100,
          type: "number"
        },
        {
          headerName: "Bronze",
          field: "bronze",
          width: 100,
          type: "number"
        },
        {
          headerName: "Year",
          field: "year",
          width: 90,
          filter: true
        },
        {
          headerName: "Country",
          field: "country",
          width: 120,
          rowGroup: true
        },
        {
          headerName: "Date",
          field: "date",
          width: 110
        },
        {
          headerName: "Sport",
          field: "sport",
          width: 110
        }
      ],
      columnTypes: {
        number: {
          editable: true,
          valueParser: function(params) {
            return parseInt(params.newValue);
          },
          aggFunc: "sum"
        }
      },
      rowData: null,
      frameworkComponents: { groupRowInnerRenderer: GroupRowInnerRenderer },
      groupRowInnerRenderer: "groupRowInnerRenderer",
      groupRowRendererParams: {
        flagCodes: {
          Ireland: "ie",
          "United States": "us",
          Russia: "ru",
          Australia: "au",
          Canada: "ca",
          Norway: "no",
          China: "cn",
          Zimbabwe: "zw",
          Netherlands: "nl",
          "South Korea": "kr",
          Croatia: "hr",
          France: "fr"
        }
      }
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
            columnTypes={this.state.columnTypes}
            rowData={this.state.rowData}
            groupUseEntireRow={true}
            frameworkComponents={this.state.frameworkComponents}
            groupRowInnerRenderer={this.state.groupRowInnerRenderer}
            groupRowRendererParams={this.state.groupRowRendererParams}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
