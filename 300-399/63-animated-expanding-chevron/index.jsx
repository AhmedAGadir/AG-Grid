'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class MyRenderer extends Component {

  state = {
    expanded: false,
  }
  
  refresh() {
    this.setState({
      expanded: this.props.node.expanded
    })
    return true;
  }

  clickHandler() {
    this.props.node.setExpanded(!this.state.expanded);
  }

  render() {
    let classList = ['my-renderer', 'fas', 'fa-chevron-right'];
    if (this.state.expanded) {
      classList.push('expanded');
    }
    return <i 
      className={classList.join(' ')} 
      onClick={this.clickHandler.bind(this)}></i>;
  }
}

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: 'name',
          cellRenderer: 'agGroupCellRenderer',
        },
        { field: 'account' },
        { field: 'calls' },
        {
          field: 'minutes',
          valueFormatter: "x.toLocaleString() + 'm'",
        },
        {
          headerName: 'Custom',
          colId: 'custom',
          cellRenderer: 'myRenderer',
        },
      ],
      defaultColDef: { flex: 1 },
      detailCellRendererParams: {
        detailGridOptions: {
          columnDefs: [
            { field: 'callId' },
            { field: 'direction' },
            {
              field: 'number',
              minWidth: 150,
            },
            {
              field: 'duration',
              valueFormatter: "x.toLocaleString() + 's'",
            },
            {
              field: 'switchCode',
              minWidth: 150,
            },
          ],
          defaultColDef: { flex: 1 },
        },
        getDetailRowData: function (params) {
          params.successCallback(params.data.callRecords);
        },
      },
      rowData: null,
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = (data) => {
      this.setState({ rowData: data });
    };

    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/simple/data/data.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  };

  onFirstDataRendered = (params) => {
    setTimeout(function () {
      params.api.getDisplayedRowAtIndex(1).setExpanded(true);
    }, 0);
  };

  onRowGroupOpened(params){
    console.log('onRoWgaroup', params);
    this.gridApi.refreshCells({
      rowNodes: [params.node],
      columns: ['custom'],
      force: true
    })
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          id="myGrid"
          style={{
            height: '100%',
            width: '100%',
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            masterDetail={true}
            detailCellRendererParams={this.state.detailCellRendererParams}
            onGridReady={this.onGridReady}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            rowData={this.state.rowData}
            frameworkComponents={{
              myRenderer: MyRenderer,
            }}
            onRowGroupOpened={this.onRowGroupOpened.bind(this)}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample></GridExample>, document.querySelector('#root'));
