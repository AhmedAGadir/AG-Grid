'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';

class GridExample extends Component {
  constructor(props) {
    super(props);

    // this.recursivelyFindCount = this.recursivelyFindCount.bind(this);

    this.state = {
      modules: AllCommunityModules,
      columnDefs: [
        { field: 'localTime' },
        {
          field: 'show',
          // cellRenderer: "showCellRenderer",
          valueGetter: params => params.data.show.name,
          rowSpan: this.countRowsToSpan,
          cellClassRules: { 'show-cell': 'value !== undefined' },
          cellStyle: {
            background: 'lightblue',
          },
          width: 200,
        },
        { field: 'a' },
        { field: 'b' },
        { field: 'c' },
        { field: 'd' },
        { field: 'e' },
      ],
      rowData: [
        {
          localTime: '5:00am',
          show: {
            name: 'Wake Up Dublin',
            presenter: 'Andrew Connell',
          },
          a: 0.231,
          b: 0.523,
          c: 0.423,
          d: 0.527,
          e: 0.342,
        },
        {
          localTime: '5:15am',
          show: {
            name: 'Wake Up Dublin',
            presenter: 'Andrew Connell',
          },
          a: 0.423,
          b: 0.452,
          c: 0.523,
          d: 0.543,
          e: 0.452,
        },
        {
          localTime: '5:30am',
          show: {
            name: 'Wake Up Dublin',
            presenter: 'Andrew Connell',
          },
          a: 0.537,
          b: 0.246,
          c: 0.426,
          d: 0.421,
          e: 0.523,
        },
        {
          localTime: '6:00am',
          show: {
            name: 'Pure Back In The Day',
            presenter: 'Kevin Flanagan',
          },
          a: 0.231,
          b: 0.523,
          c: 0.423,
          d: 0.527,
          e: 0.342,
        },
        {
          localTime: '7:00am',
          show: {
            name: 'The Queens Breakfast',
            presenter: 'Tony Smith',
          },
          a: 0.231,
          b: 0.523,
          c: 0.423,
          d: 0.527,
          e: 0.342,
        },
        {
          localTime: '7:15am',
          show: {
            name: 'The Queens Breakfast',
            presenter: 'Tony Smith',
          },
          a: 0.423,
          b: 0.452,
          c: 0.523,
          d: 0.543,
          e: 0.452,
        },
      ],
      components: { showCellRenderer: createShowCellRenderer() },
      defaultColDef: {
        resizable: true,
        width: 100,
      },
    };
  }

  countRowsToSpan = params => {
    if (this.alreadyProcessed(params)) {
      return 1;
    }
    return this.countSuccessiveEqNodes(params);
  };

  alreadyProcessed = params => {
    let currentShowName = params.data.show.name;
    let previousNode = params.api.getRowNode(params.node.rowIndex - 1);
    return previousNode && previousNode.data.show.name === currentShowName;
  };

  countSuccessiveEqNodes = params => {
    let nextNode = params.api.getRowNode(params.node.rowIndex + 1);
    if (!this.areNodesEq(params.node, nextNode)) {
      return 1;
    } else {
      return (
        1 +
        this.countSuccessiveEqNodes({
          ...params,
          node: nextNode,
          data: nextNode.data,
        })
      );
    }
  };

  areNodesEq = (node1, node2) => {
    return node2 && node1.data.show.name === node2.data.show.name;
  };

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
            modules={this.state.modules}
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            components={this.state.components}
            defaultColDef={this.state.defaultColDef}
            suppressRowTransform={true}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    );
  }
}

function createShowCellRenderer() {
  function ShowCellRenderer() {}
  ShowCellRenderer.prototype.init = function(params) {
    var cellBlank = !params.value;
    if (cellBlank) {
      return null;
    }
    this.ui = document.createElement('div');
    this.ui.innerHTML =
      '<div class="show-name">' +
      params.value.name +
      '' +
      '</div>' +
      '<div class="show-presenter">' +
      params.value.presenter +
      '</div>';
  };
  ShowCellRenderer.prototype.getGui = function() {
    return this.ui;
  };
  return ShowCellRenderer;
}

render(<GridExample />, document.querySelector('#root'));
