import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";

import ReactTooltip from "react-tooltip";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import "./style.css";

import "ag-grid-enterprise";

class MyCellRenderer extends Component {
  render() {
    return (
      <div>
        <a data-tip={this.props.value}> ◕‿‿◕ </a>
        <ReactTooltip place="right" type="dark" effect="float" />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          field: "athlete",
          cellRendererFramework: MyCellRenderer,
          minWidth: 220
        },
        {
          field: "country",
          minWidth: 200
        },
        { field: "year" },
        {
          field: "sport",
          minWidth: 200
        },
        { field: "gold" },
        { field: "silver" },
        { field: "bronze" }
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 100
      },
      rowModelType: "serverSide",
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      var fakeServer = createFakeServer(data);
      var datasource = createServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    };

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json"
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
      <div>
        <div
          className="ag-theme-alpine"
          style={{ height: "100vh", width: "100vw" }}
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            rowModelType={this.state.rowModelType}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    );
  }
}


function createServerSideDatasource(server) {
  return {
    getRows: function(params) {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      var response = server.getData(params.request);
      setTimeout(function() {
        if (response.success) {
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 500);
    },
  };
}
function createFakeServer(allData) {
  return {
    getData: function(request) {
      var requestedRows = allData.slice(request.startRow, request.endRow);
      var lastRow = getLastRowIndex(request, requestedRows);
      return {
        success: true,
        rows: requestedRows,
        lastRow: lastRow,
      };
    },
  };
}
function getLastRowIndex(request, results) {
  if (!results) return undefined;
  var currentLastRow = request.startRow + results.length;
  return currentLastRow < request.endRow ? currentLastRow : undefined;
}


render(<App />, document.getElementById("root"));
