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
          headerName: "ID",
          width: 50,
          valueGetter: "node.id",
          cellRenderer: "loadingCellRenderer",
          sortable: false,
          suppressMenu: true
        },
        {
          headerName: "Athlete",
          field: "athlete",
          width: 150,
          suppressMenu: true
        },
        {
          headerName: "Age",
          field: "age",
          width: 90,
          filter: "agNumberColumnFilter",
          filterParams: {
            filterOptions: ["equals", "lessThan", "greaterThan"],
            suppressAndOrCondition: true
          }
        },
        {
          headerName: "Country",
          field: "country",
          width: 120,
          filter: "agSetColumnFilter",
          filterParams: { values: countries() }
        },
        {
          headerName: "Year",
          field: "year",
          width: 90,
          filter: "agSetColumnFilter",
          filterParams: {
            values: ["2000", "2004", "2008", "2012"]
          }
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
          suppressMenu: true
        },
        {
          headerName: "Gold",
          field: "gold",
          width: 100,
          suppressMenu: true
        },
        {
          headerName: "Silver",
          field: "silver",
          width: 100,
          suppressMenu: true
        },
        {
          headerName: "Bronze",
          field: "bronze",
          width: 100,
          suppressMenu: true
        },
        {
          headerName: "Total",
          field: "total",
          width: 100,
          suppressMenu: true
        }
      ],
      defaultColDef: {
        sortable: true,
        resizable: true
      },
      rowModelType: "infinite",
      paginationPageSize: 100,
      cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 2,
      infiniteInitialRowCount: 1,
      maxBlocksInCache: 2,
      getRowNodeId: function(item) {
        return item.id;
      },
      components: {
        loadingCellRenderer: function(params) {
          if (params.value !== undefined) {
            return params.value;
          } else {
            return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/loading.gif">';
          }
        }
      }
    };
  }

  onSortChanged(params) {
    if (params.api.getCacheBlockState()[0].pageStatus === 'loaded') {
      let rows = [];
      params.api.forEachNode(node => rows.push(node.data));
      console.log('rows', rows);
    } else {
      console.log('recursively calling onSortChanged')
      setTimeout(() => this.onSortChanged(params), 100);
    }
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      data.forEach(function(data, index) {
        data.id = "R" + (index + 1);
      });
      var dataSource = {
        rowCount: null,
        getRows: function(params) {
          console.log("asking for " + params.startRow + " to " + params.endRow);
          setTimeout(function() {
            var dataAfterSortingAndFiltering = sortAndFilter(data, params.sortModel, params.filterModel);
            var rowsThisPage = dataAfterSortingAndFiltering.slice(params.startRow, params.endRow);
            var lastRow = -1;
            if (dataAfterSortingAndFiltering.length <= params.endRow) {
              lastRow = dataAfterSortingAndFiltering.length;
            }
            params.successCallback(rowsThisPage, lastRow);
          }, 3000);
        }
      };
      params.api.setDatasource(dataSource);
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
            defaultColDef={this.state.defaultColDef}
            rowSelection={this.state.rowSelection}
            rowModelType={this.state.rowModelType}
            paginationPageSize={this.state.paginationPageSize}
            cacheOverflowSize={this.state.cacheOverflowSize}
            maxConcurrentDatasourceRequests={this.state.maxConcurrentDatasourceRequests}
            infiniteInitialRowCount={this.state.infiniteInitialRowCount}
            maxBlocksInCache={this.state.maxBlocksInCache}
            getRowNodeId={this.state.getRowNodeId}
            components={this.state.components}
            onGridReady={this.onGridReady}
            onSortChanged={this.onSortChanged}
          />
        </div>
      </div>
    );
  }
}

function countries() {
  return [
    "United States",
    "Russia",
    "Australia",
    "Canada",
    "Norway",
    "China",
    "Zimbabwe",
    "Netherlands",
    "South Korea",
    "Croatia",
    "France",
    "Japan",
    "Hungary",
    "Germany",
    "Poland",
    "South Africa",
    "Sweden",
    "Ukraine",
    "Italy",
    "Czech Republic",
    "Austria",
    "Finland",
    "Romania",
    "Great Britain",
    "Jamaica",
    "Singapore",
    "Belarus",
    "Chile",
    "Spain",
    "Tunisia",
    "Brazil",
    "Slovakia",
    "Costa Rica",
    "Bulgaria",
    "Switzerland",
    "New Zealand",
    "Estonia",
    "Kenya",
    "Ethiopia",
    "Trinidad and Tobago",
    "Turkey",
    "Morocco",
    "Bahamas",
    "Slovenia",
    "Armenia",
    "Azerbaijan",
    "India",
    "Puerto Rico",
    "Egypt",
    "Kazakhstan",
    "Iran",
    "Georgia",
    "Lithuania",
    "Cuba",
    "Colombia",
    "Mongolia",
    "Uzbekistan",
    "North Korea",
    "Tajikistan",
    "Kyrgyzstan",
    "Greece",
    "Macedonia",
    "Moldova",
    "Chinese Taipei",
    "Indonesia",
    "Thailand",
    "Vietnam",
    "Latvia",
    "Venezuela",
    "Mexico",
    "Nigeria",
    "Qatar",
    "Serbia",
    "Serbia and Montenegro",
    "Hong Kong",
    "Denmark",
    "Portugal",
    "Argentina",
    "Afghanistan",
    "Gabon",
    "Dominican Republic",
    "Belgium",
    "Kuwait",
    "United Arab Emirates",
    "Cyprus",
    "Israel",
    "Algeria",
    "Montenegro",
    "Iceland",
    "Paraguay",
    "Cameroon",
    "Saudi Arabia",
    "Ireland",
    "Malaysia",
    "Uruguay",
    "Togo",
    "Mauritius",
    "Syria",
    "Botswana",
    "Guatemala",
    "Bahrain",
    "Grenada",
    "Uganda",
    "Sudan",
    "Ecuador",
    "Panama",
    "Eritrea",
    "Sri Lanka",
    "Mozambique",
    "Barbados"
  ];
}
function sortAndFilter(allOfTheData, sortModel, filterModel) {
  return sortData(sortModel, filterData(filterModel, allOfTheData));
}
function sortData(sortModel, data) {
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
}
function filterData(filterModel, data) {
  var filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }
  var resultOfFilter = [];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    if (filterModel.age) {
      var age = item.age;
      var allowedAge = parseInt(filterModel.age.filter);
      if (filterModel.age.type == "equals") {
        if (age !== allowedAge) {
          continue;
        }
      } else if (filterModel.age.type == "lessThan") {
        if (age >= allowedAge) {
          continue;
        }
      } else {
        if (age <= allowedAge) {
          continue;
        }
      }
    }
    if (filterModel.year) {
      if (filterModel.year.values.indexOf(item.year.toString()) < 0) {
        continue;
      }
    }
    if (filterModel.country) {
      if (filterModel.country.values.indexOf(item.country) < 0) {
        continue;
      }
    }
    resultOfFilter.push(item);
  }
  return resultOfFilter;
}

render(<GridExample />, document.querySelector("#root"));
