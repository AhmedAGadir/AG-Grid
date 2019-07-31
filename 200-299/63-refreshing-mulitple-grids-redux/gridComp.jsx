import React, { Component } from 'react';
import {AgGridReact} from "ag-grid-react";
import "ag-grid-enterprise";

class GridComp extends Component {
  colDefs = [
    {field: "id", editable: false, width :50 },
    {field: "name", editable: false, resizable : true, width : 80 },
    {field: "rating", editable: false, resizable : true, width : 80 },
    {field: "minLoad", editable: true, resizable : true, width : 90 },
    {field: "maxLoad", editable: true, resizable : true, width : 90 },
    {field: "normLoad", editable: true, resizable : true, width : 90 },
  ];

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
    this.props.onGridReady(params);
  }

  render() {
    return (
      <div
        style={{ height: 250, marginBottom: '2rem' }}
        className="ag-theme-balham"
      >
        <AgGridReact
          columnDefs={this.colDefs}
          rowData={this.props.rowData}
          onGridReady={this.onGridReady.bind(this)}
          deltaRowDataMode={true}
          getRowNodeId={data => data.id}
          stopEditingWhenGridLosesFocus={true}
          onCellValueChanged={this.props.onCellValueChanged}
        />
      </div>
    );
  }
}

export default GridComp;
