'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import BooleanFloatingFilter from './booleanFloatingFilter.jsx';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: 'Athlete',
          field: 'athlete',
          width: 150,
        },
        {
          headerName: 'Age',
          field: 'age',
          width: 150,
          // filter: "agNumberColumnFilter"
          floatingFilterComponentFramework: BooleanFloatingFilter,
          floatingFilterComponentParams: {
            debounceMs: 750,
            suppressFilterButton: false,
          },
          filter: 'agSetColumnFilter',
          filterParams: {
            values: ['true', 'false'],
            comparator: this.booleanComparator,
          },
        },
      ],
      defaultColDef: {
        resizable: true,
        filter: true,
      },
      components: { countryCellRenderer: countryCellRenderer },
      rowData: null,
    };
  }

  booleanComparator = (filter, cellValue) => {
    const f = JSON.parse(filter);
    const c = JSON.parse(cellValue);
    return f && c;
  };

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      patchData(data);
      this.setState({ rowData: data });
    };

    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
         let data = JSON.parse(httpRequest.responseText).map(row => ({
          ...row,
          age: Math.random() < 0.5        
          }));
        updateData(data);
      }
    };
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          id="myGrid"
          style={{
            height: '100%',
            width: '100%',
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            components={this.state.components}
            rowData={this.state.rowData}
            floatingFilter={true}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    );
  }
}

function irishAthletes() {
  return [
    'John Joe Nevin',
    'Katie Taylor',
    'Paddy Barnes',
    'Kenny Egan',
    'Darren Sutherland',
    'Margaret Thatcher',
    'Tony Blair',
    'Ronald Regan',
    'Barack Obama',
  ];
}
function countryCellRenderer(params) {
  return params.value.name + ' (' + params.value.code + ')';
}
function countryKeyCreator(params) {
  var countryObject = params.value;
  var key = countryObject.name;
  return key;
}
function patchData(data) {
  data.forEach(function(row) {
    var countryName = row.country;
    var countryCode = countryName.substring(0, 2).toUpperCase();
    row.country = {
      name: countryName,
      code: countryCode,
    };
  });
}

render(<GridExample />, document.querySelector('#root'));
