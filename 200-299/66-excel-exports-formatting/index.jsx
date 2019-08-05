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
          headerName: 'Date',
          field: 'date',
          menuTabs: ['filterMenuTab', 'columnsMenuTab', 'generalMenuTab'],
          sort: 'desc',
          width: 200,
          cellClass: 'dateTimeFormat',
          // cellRendererFramework: DateCellRenderer,
          valueGetter: ({ data }) => {
            const [day, month, year] = data.date.split('/');
            return new Date(year, month - 1, day).toISOString();
          },
          valueFormatter: ({value}) => {
           let date = new Date(value);
           let day = date.getDate();
           let month = date.getMonth() + 1;
           let year = date.getFullYear();
           return month.toString().padStart(2,0) + '-' + day.toString().padStart(2,0) + '-' + year;
          },
          filter: 'agDateColumnFilter',
          filterParams: {
            apply: true,
            filterOptions: ['equals', 'inRange', 'greaterThanOrEqual'],
            newRowsAction: 'keep',
            suppressAndOrCondition: true
          },
        },
      ],
      defaultColDef: {
        sortable: true,
        filter: false,
        resizable: true,
      },
      rowData: null,
      excelStyles: [
        {
          id: 'dateTimeFormat',
          dataType: 'dateTime',
          numberFormat: {
            // how excel will format and display your dateTime
            format: 'm/d/yyyy' 
          },
        },
      ],
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
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText).slice(0, 10));
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
            defaultColDef={this.state.defaultColDef}
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            getRowHeight={() => 29}
            headerHeight={30}
            groupHeaderHeight={30}
            stopEditingWhenGridLosesFocus
            animateRows
            rowModelType="clientSide"
            enableRangeSelection
            excelStyles={this.state.excelStyles}
            onGridReady={this.onGridReady.bind(this)}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector('#root'));
