'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: 'Sport',
          field: 'sport',
          checkboxSelection: true,
          width: 110,
          filter: 'agSetColumnFilter',
          menuTabs: ['filterMenuTab'],
          icons: {
            checkboxUnchecked:
              '<span style="border: 2px solid lightgrey"><input type="checkbox" onclick="return false;"/></span>',
            checkboxChecked:
              '<span style="border: 2px solid #0091EA"><input type="checkbox" onclick="return false;" checked="true"></span>',
          },
        },
      ],
      rowData: null,
      icons: {
        checkboxUnchecked: '<span style="border: 2px solid lightgrey"><input type="checkbox" onclick="return false;"/></span>',
        checkboxChecked:
          '<span style="border: 2px solid #0091EA"><input type="checkbox" onclick="return false;" checked="true"></span>',
      },
    };
  }

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
        updateData(JSON.parse(httpRequest.responseText));
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
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}
            icons={this.state.icons}
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
