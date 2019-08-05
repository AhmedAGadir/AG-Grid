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
          headerName: "Age",
          field: "age"
        },
        {
          headerName: "Country",
          field: "country",
          width: 200,
          rowGroup: true,
          hide: true
        },
        {
          headerName: "Year",
          field: "year"
        },
        {
          headerName: "Sport",
          field: "sport"
        },
        {
          headerName: "Gold",
          field: "gold"
        },
        {
          headerName: "Silver",
          field: "silver"
        },
        {
          headerName: "Bronze",
          field: "bronze"
        }
      ],
      defaultColDef: {
        width: 100,
        sortable: true,
        resizable: true
      },
      autoGroupColumnDef: { width: 150 },
      rowModelType: "serverSide",
      cacheBlockSize: 50,
      compact: false
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
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  };
  
  onBtApply(reverse) {
    this.setState({ compact: !reverse }, () => {
      if (this.gridApi) {
        // this.gridApi.forEachNode(node => {
        //   let rowHeight = reverse ? 42 : 32;
        //   node.setRowHeight(rowHeight);
        // });
        // this.gridApi.onRowHeightChanged();
        this.gridApi.purgeServerSideCache()
      }
    });
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <button onClick={this.onBtApply.bind(this, false)}>Update RowHeight</button>
        <button onClick={this.onBtApply.bind(this, true)}>Reset RowHeight</button>
        <div
          id="myGrid"
          style={{
            height: "100%",
            width: "100%"
          }}
          className="ag-theme-balham-dark"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            autoGroupColumnDef={this.state.autoGroupColumnDef}
            rowModelType={this.state.rowModelType}
            cacheBlockSize={this.state.cacheBlockSize}
            sideBar={this.state.sideBar}
            animateRows={true}
            // debug={true}
            onGridReady={this.onGridReady}
            getRowHeight={params => {
              return this.state.compact ? 25: 50;
            }}
          />
        </div>
      </div>
    );
  }
}

function createServerSideDatasource(fakeServer) {
  function ServerSideDatasource(fakeServer) {
    this.fakeServer = fakeServer;
  }
  ServerSideDatasource.prototype.getRows = function(params) {
    console.log("ServerSideDatasource.getRows: params = ", params);
    var request = params.request;
    var groupKeys = request.groupKeys;
    var doingTopLevel = groupKeys.length === 0;
    if (doingTopLevel) {
      this.fakeServer.getTopLevelCountryList(successCallback, request);
    } else {
      var country = request.groupKeys[0];
      this.fakeServer.getCountryDetails(successCallback, country, request);
    }
    function successCallback(resultForGrid, lastRow) {
      params.successCallback(resultForGrid, lastRow);
    }
  };
  return new ServerSideDatasource(fakeServer);
}
function createFakeServer(data) {
  function FakeServer(allData) {
    this.initData(allData);
  }
  FakeServer.prototype.initData = function(allData) {
    var topLevelCountryGroups = [];
    var bottomLevelCountryDetails = {};
    allData.forEach(function(dataItem) {
      var country = dataItem.country;
      var childrenThisCountry = bottomLevelCountryDetails[country];
      var groupThisCountry = _.find(topLevelCountryGroups, { country: country });
      if (!childrenThisCountry) {
        childrenThisCountry = [];
        bottomLevelCountryDetails[country] = childrenThisCountry;
        groupThisCountry = {
          country: country,
          gold: 0,
          silver: 0,
          bronze: 0
        };
        topLevelCountryGroups.push(groupThisCountry);
      }
      childrenThisCountry.push(dataItem);
      groupThisCountry.gold += dataItem.gold;
      groupThisCountry.silver += dataItem.silver;
      groupThisCountry.bronze += dataItem.bronze;
    });
    this.topLevelCountryGroups = topLevelCountryGroups;
    this.bottomLevelCountryDetails = bottomLevelCountryDetails;
    this.topLevelCountryGroups.sort(function(a, b) {
      return a.country < b.country ? -1 : 1;
    });
  };
  FakeServer.prototype.sortList = function(data, sortModel) {
    var sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
      return data;
    }
    var resultOfSort = data.slice();
    resultOfSort.sort(function(a, b) {
      for (var k = 0; k < sortModel.length; k++) {
        var sortColModel = sortModel[k];
        var valueA = a[sortColModel.colId];
        var valueB = b[sortColModel.colId];
        if (valueA == valueB) {
          continue;
        }
        var sortDirection = sortColModel.sort === "asc" ? 1 : -1;
        if (valueA > valueB) {
          return sortDirection;
        } else {
          return sortDirection * -1;
        }
      }
      return 0;
    });
    return resultOfSort;
  };
  FakeServer.prototype.getTopLevelCountryList = function(callback, request) {
    var lastRow = this.getLastRowResult(this.topLevelCountryGroups, request);
    var rowData = this.getBlockFromResult(this.topLevelCountryGroups, request);
    setTimeout(function() {
      callback(rowData, lastRow);
    }, 1000);
  };
  FakeServer.prototype.getCountryDetails = function(callback, country, request) {
    var countryDetails = this.bottomLevelCountryDetails[country];
    var countryDetailsSorted = this.sortList(countryDetails, request.sortModel);
    var lastRow = this.getLastRowResult(countryDetailsSorted, request);
    var rowData = this.getBlockFromResult(countryDetailsSorted, request);
    setTimeout(function() {
      callback(rowData, lastRow);
    }, 1000);
  };
  FakeServer.prototype.getBlockFromResult = function(data, request) {
    return data.slice(request.startRow, request.endRow);
  };
  FakeServer.prototype.getLastRowResult = function(result, request) {
    var lastRowFound = result.length <= request.endRow;
    var lastRow = lastRowFound ? result.length : null;
    return lastRow;
  };
  return new FakeServer(data);
}

render(<GridExample />, document.querySelector("#root"));
