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
        { field: 'athlete', width: 150 },
        { field: 'age', width: 90 },
        {
          field: 'country',
          rowGroup: true,
          width: 120
        },
        { field: 'year', width: 90 },
        { field: 'date', width: 110 },
        { field: 'sport', width: 110 },
        { field: 'gold', width: 100 },
        { field: 'silver', width: 100 },
        { field: 'bronze', width: 100 },
        { field: 'total', width: 100 },
      ],
      rowData: null,
      frameworkComponents: {
        fullWidthCellRenderer: FullWidthCellRenderer,
      },
      fullWidthCellRenderer: 'fullWidthCellRenderer',
      rowBuffer: 9999
    };
  }

  onRowGroupOpened = params => {
    if (params.node.expanded) {
      this.gridApi.dispatchEvent({
        type: 'myCustomEvent',
        rowIndex: params.rowIndex,
      });
    }
  };

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
        updateData(JSON.parse(httpRequest.responseText).slice(0, 100));
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
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}
            frameworkComponents={this.state.frameworkComponents}
            isFullWidthCell={node => !node.group}
            fullWidthCellRenderer={this.state.fullWidthCellRenderer}
            onRowGroupOpened={this.onRowGroupOpened}
            rowBuffer={this.state.rowBuffer}
          />
        </div>
      </div>
    );
  }
}


class FullWidthCellRenderer extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.onMyCustomEvent = this.onMyCustomEvent.bind(this);
  }
  componentDidMount() {
    this.props.api.addEventListener('myCustomEvent', this.onMyCustomEvent);
  }
  onMyCustomEvent(params) {
    if (params.rowIndex === this.props.node.parent.rowIndex) {
      this.props.node.setRowHeight(this.myRef.current.offsetHeight);
      this.props.api.onRowHeightChanged();
    }
  }
  destroy() {
    this.props.api.removeEventListener('myCustomEvent', this.onMyCustomEvent);
  }
  render() {
    return (
      <div ref={this.myRef} style={{ padding: 30 }}>
        {Object.keys(this.props.data).map(key => (
          <div>{this.props.data[key]}</div>
        ))}
      </div>
    );
  }
}

render(<GridExample />, document.querySelector('#root'));
