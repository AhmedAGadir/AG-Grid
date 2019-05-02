"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
// import "ag-grid-enterprise";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.gridOptions = GridExample.initializeGridOptions();
    this.defaultColDef = GridExample.initializeDefaultColDef();
    this.extraProps = {
      overlayNoRowsTemplate:
        "<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">No entries match the filter</span>",
      overlayLoadingTemplate:
        "<span style=\"padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;\">LOADING!!!</span>"
    };

    this.state = {
      dataSet: 'A',
      rowData: GridExample.createRowData(true)
    };
  }

  componentDidUpdate(nextProps, nextState) {
    console.log('componentDidUpdate');
    if (this.state.dataSet === nextState.dataSet) {
      setTimeout(() => {
        this.showOrHideOverlay();
      }, 300)
    }
  }

  static initializeGridOptions() {
    return {
      suppressMenuHide: true,
      deltaRowDataMode: true,
      // <========== THIS !!Callback to associate our own id to ag-grid Rows
      getRowNodeId: (data) => {
        if (data) {
          return data.row;
        }
        return null;
      },
      enableCellChangeFlash: true,
      enableSorting: true,
      enableFilter: true,
      animateRows: true,
      columnDefs: GridExample.createColumnDefs(),
      multiSortKey: 'ctrl',
      suppressContextMenu: true,
    };
  }

  static initializeDefaultColDef() {
    return {
      enableCellChangeFlash: true
    };
  }

  static createColumnDefs() {
    return [
      {
        headerName: 'Row',
        field: 'row',
        width: 40,
        pinned: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          clearButton: true
        }
      },
      {
        headerName: 'Name',
        field: 'name',
        width: 40,
        filter: 'agTextColumnFilter',
        filterParams: {
          clearButton: true
        }
      },
      {
        headerName: 'Misc',
        field: 'misc',
        width: 40,
        filter: 'agSetColumnFilter',
        filterParams: {
          clearButton: true
        }
      },
      {
        headerName: 'Enum',
        field: 'enum',
        width: 40,
        filter: 'agSetColumnFilter',
        filterParams: {
          clearButton: true
        }
      },
      {
        headerName: 'Number',
        field: 'number',
        width: 40,
        filter: 'agNumberColumnFilter',
        filterParams: {
          clearButton: true
        }
      }
    ];
  }

  onGridReadyNative = (event) => {
    this.gridApi = event.api;
    this.columnApi = event.columnApi;

    this.gridApi.sizeColumnsToFit();
  };

  static createRowData(n) {
    return [
      {
        row: 'Row 1',
        name: 'Michael Phelps',
        enum: 'CFC-1',
        misc: 'alpha',
        number: 123
      },
      {
        row: 'Row 2',
        name: 'Natalie Coughlin',
        enum: n ? 'CFC-2' : 'CFC-1',
        misc: n ? 'bravo' : 'alpha',
        number: 456
      },
      {
        row: 'Row 3',
        name: 'Aleksey Nemov',
        enum: n ? 'CFC-2' : 'CFC-3',
        misc: n ? 'charlie' : '',
        number: 789
      },
      {
        row: 'Row 4',
        name: 'Alicia Coutts',
        enum: 'CFC-1',
        misc: n ? 'delta' : 'alpha',
        number: 123
      },
      {
        row: 'Row 5',
        name: 'Missy Franklin',
        enum: 'CFC-1',
        misc: 'alpha',
        number: 52
      },
      {
        row: 'Row 6',
        name: 'Ryan Lochte',
        enum: n ? 'CFC-2' : 'CFC-3',
        misc: n ? 'bravo' : '',
        number: 777
      },
      {
        row: 'Row 7',
        name: 'Allison Schmitt',
        enum: n ? 'CFC-2' : 'CFC-1',
        misc: n ? 'charlie' : 'alpha',
        number: 319
      },
      {
        row: 'Row 8',
        name: 'Ian Thorpe',
        enum: 'CFC-1',
        misc: n ? 'delta' : 'alpha',
        number: 4
      },
      {
        row: 'Row 9',
        name: 'Bob Mill',
        enum: 'CFC-1',
        misc: n ? 'delta' : '',
        number: 777
      },
      {
        row: 'Row 10',
        name: 'Willy Walsh',
        enum: 'CFC-1',
        misc: n ? 'delta' : 'alpha',
        number: 500
      },
      {
        row: 'Row 11',
        name: 'Sarah McCoy',
        enum: 'CFC-1',
        misc: n ? 'delta' : 'alpha',
        number: 491
      },
      {
        row: 'Row 12',
        name: 'Jane Jack',
        enum: 'CFC-1',
        misc: n ? 'delta' : '',
        number: 123
      },
      {
        row: 'Row 13',
        name: 'Tina Wills',
        enum: 'CFC-1',
        misc: n ? 'delta' : '',
        number: 777
      }
    ];
  }

  onChangeDataClick = () => {
    console.log('onChangeDataClick');
    this.gridApi.showLoadingOverlay();
    setTimeout(() => {
      this.setState({
        rowData: GridExample.createRowData(false),
        dataSet: 'A'
      });
    }, 500);
  };

  onChangeDataAgainClick = () => {
    console.log('onChangeDataAgainClick');
    this.gridApi.showLoadingOverlay();
    setTimeout(() => {
      this.setState({
        rowData: GridExample.createRowData(true),
        dataSet: 'B'
      });
    }, 500);
  };

  
  showOrHideOverlay = (params) => {
      if (this.gridApi.getModel().rowsToDisplay.length === 0) {
        console.log('showNoRowsOverlay')
        this.gridApi.showNoRowsOverlay();
      } else {
        console.log('hideOverlay')
        this.gridApi.hideOverlay();
      }
  }

  render() {
    console.log('render')
    return (
      <div style={{ height: 450, width: 1145 }} className="ag-theme-fresh">
        <h2>DataGrid Enterprise tests: AgSetColumnFilter</h2>
        <p>
          Filter 'Name' column so that everything be filtered out (i.e. Enter 'xxx' in filter)<br />
          Notice how the grid displays: 'No entries match the filter'<br />
          Press 'change data' button <br />
          Notice The 'Loading' overlay and how all items are still filtered out (i.e. still no 'xxx' in updated data) and there's no 'No entries match the filter'<br />
          Note that if you press 'Change data' button again, then 'No entries match the filter' does not show up<br />
        </p>
        <button
          id="change-data"
          onClick={this.onChangeDataClick}
        >Change data</button>
        <button
          id="change-data-again"
          onClick={this.onChangeDataAgainClick}
        >Change data again</button>
        <div
          className="ag-theme-balham"
          style={{
              height: '225px',
              width: '945px'
          }}
        >
          <AgGridReact
            gridOptions={this.gridOptions}
            defaultColDef={this.defaultColDef}
            enableFilter
            onGridReady={this.onGridReadyNative}
            rowData={this.state.rowData}
            suppressRowClickSelection
            overlayNoRowsTemplate={this.extraProps.overlayNoRowsTemplate}
            overlayLoadingTemplate={this.extraProps.overlayLoadingTemplate}
            onFilterChanged={() => {
              console.log('onFilterChanged')
              this.showOrHideOverlay()
            }}
            onRowDataUpdated={() => {
              console.log('onRowDataUpdated')
              this.showOrHideOverlay()
              }}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
