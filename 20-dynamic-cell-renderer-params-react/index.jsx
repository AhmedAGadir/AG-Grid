'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import GenderCellRenderer from './genderCellRenderer.jsx';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: 'genderStatic',
          width: 90,
          cellRenderer: 'genderCellRenderer',
          cellEditor: 'agRichSelectCellEditor',
          cellEditorParams: {
            values: ['icon-cog', 'icon-table'],
            cellRenderer: 'genderCellRenderer',
          },
        },
        {
          field: 'genderParams',
          width: 90,
          cellRenderer: 'genderCellRenderer',
          cellEditor: 'agRichSelectCellEditor',
          cellEditorParams: params => {
            let values;
            switch (params.data.country) {
              case 'Ireland':
                values = ['<i class="icon-headphones"/>', 'icon-volume-up'];
                break;
              case 'China':
                values = ['<i class="icon-camera"/>', 'icon-bookmark']
                break;
              default:
                values = ['<i class="icon-lightbulb"/>', 'icon-umbrella']
            }
            return {
              values: values,
              cellRenderer: 'genderCellRenderer',
            }
          },
        },
      ],
      rowData: [
        {
          genderStatic: 'icon-cog',
          genderParams: 'icon-headphones',
          country: 'Ireland',
        },
        {
          genderStatic: 'icon-cog',
          genderParams: 'icon-camera',
          country: 'China',
        },
        {
          genderStatic: 'icon-cog',
          genderParams: 'icon-umbrella',
          country: 'France',
        }
      ],
      frameworkComponents: { genderCellRenderer: GenderCellRenderer },
      defaultColDef: { editable: true },
      onGridReady: function(params) {
        params.api.sizeColumnsToFit();
      },
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();
  }

  onCellValueChanged(params) {
    var colId = params.column.getId();
    if (colId === 'country') {
      var selectedCountry = params.data.country;
      var selectedCity = params.data.city;
      var allowedCities = this.countyToCityMap(selectedCountry);
      var cityMismatch = allowedCities.indexOf(selectedCity) < 0;
      if (cityMismatch) {
        params.node.setDataValue('city', null);
      }
    }
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          id="myGrid"
          style={{
            boxSizing: 'border-box',
            height: '100%',
            width: '100%',
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            frameworkComponents={this.state.frameworkComponents}
            enableColResize={true}
            defaultColDef={this.state.defaultColDef}
            onGridReady={this.state.onGridReady}
            onGridReady={this.onGridReady.bind(this)}
            onCellValueChanged={this.onCellValueChanged.bind(this)}
          />
        </div>
      </div>
    );
  }
}

function countyToCityMap(match) {
  var map = {
    Ireland: ['Dublin', 'Cork', 'Galway'],
    USA: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
  };
  return map[match];
}

render(<GridExample />, document.querySelector('#root'));
