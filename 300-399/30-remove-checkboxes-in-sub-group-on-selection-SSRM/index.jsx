'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from '@ag-grid-community/react';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine-dark.css';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modules: AllModules,
      columnDefs: [
        {
          colId: 'country',
          valueGetter: 'data.country',
          rowGroup: true,
          hide: true,
        },
        {
          field: 'sport',
          rowGroup: true,
          hide: true,
        },
        {
          field: 'gold',
          aggFunc: 'sum',
        },
        {
          field: 'silver',
          aggFunc: 'sum',
        },
        {
          field: 'bronze',
          aggFunc: 'sum',
        },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 120,
        resizable: true,
        sortable: true,
      },
      autoGroupColumnDef: {
        flex: 1,
        minWidth: 280,
        cellRendererParams: {
          checkbox: params => this.recursivelyCheckSelectedParents(params.node),
        },
      },
      rowModelType: 'serverSide',
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      var fakeServer = new FakeServer(data);
      var datasource = new ServerSideDatasource(fakeServer);
      params.api.setServerSideDatasource(datasource);
    };

    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  };

  recursivelyCheckSelectedParents = node => {
    let parent = node.parent;
    while (parent) {
      if (node.parent) {
        if (node.parent.selected) {
          return false;
        }
      }
      return true;
    }
  };

  onRowSelect = params => {
  let expandedNodes = [];
    params.api.forEachNode(node => {
      if (node.expanded) {
        expandedNodes.push(node.key);
      }
    });
    
    params.api.purgeServerSideCache();

    let expandInterval = setInterval(() => {
      params.api.forEachNode(node => {
        let index = expandedNodes.findIndex(ind => ind === node.key);
        if (index !== -1) {
          node.setExpanded(true);
          expandedNodes.splice(index, 1);
          if (expandedNodes.length === 0) {
            clearInterval(expandInterval);
          }
        }
      });
    }, 500);
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
          className="ag-theme-alpine-dark"
        >
          <AgGridReact
            modules={this.state.modules}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            autoGroupColumnDef={this.state.autoGroupColumnDef}
            rowModelType={this.state.rowModelType}
            suppressAggFuncInHeader={true}
            animateRows={true}
            rowSelection="multiple"
            onGridReady={this.onGridReady}
            onRowSelected={this.onRowSelect}
          />
        </div>
      </div>
    );
  }
}

function ServerSideDatasource(server) {
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
      }, 200);
    },
  };
}

render(<GridExample></GridExample>, document.querySelector('#root'));
