"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

// instructions
// press the 'set values' button
// notice how validation has been done and the submit button is now disabled

// you can do validation in 2 places:
// 1) before you update your state, like in this example 
// 2) after updating your state, via iterating over all your row data

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {field: 'firstName'},
        {field: 'lastName'},
        {field: 'email'},
      ],
      defaultColDef: {
        editable: true,
        cellStyle: params => {
          return this.state.invalidCells && this.state.invalidCells.some(cell => params.node.rowIndex === cell.rowInd && params.column.colId === cell.field) ?
          { color: 'red'}
          : {color: 'green'}
        }
      },
      rowData: [
        {id: 1, firstName: null, lastName: null, email: null}
      ],
      invalidCells: null,
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onRowDataUpdated = params => {
    // console.log('onRowDataUpdated', params)
    // you could do validation here
    // iterate over all rows and validate them
  }

  setValues = () => {
    let newRows = [{
      id: 1, 
      firstName: 'John', 
      lastName: 'Bob',
      email: 'johnbob@@johnbob.com' // invalid email3
      }];
    let invalidCells = this.validateRows(newRows);
    this.setState({
      rowData: newRows,
      invalidCells: invalidCells,
    });
  }

  validateRows = (rows) => {
    let invalidRows = [];
    rows.forEach((row, rowInd) => {
      let fields = Object.keys(row);
      fields.forEach(field => {
        let cellValue = row[field];
        let isCellValid = this.validateCell(cellValue, field);
        if (!isCellValid) {
          invalidRows.push({rowInd: rowInd, field: field});
        }
      })
    });
    return invalidRows.length > 0 ? invalidRows : null;
  }

  validateCell(value, column) {
    switch (column) {
      case 'firstName':
        return typeof value === 'string'
      case 'lastName':
        return typeof value === 'string';
      case 'email':
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(value).toLowerCase());
      default: 
        return true
    }
  }

  render() {
    return (
      <div>
      <button 
        onClick={this.setValues}
        >Set values</button>
        <div
          id="myGrid"
          style={{ height: "63px" }}
          className="ag-theme-balham"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            rowData={this.state.rowData}
            onGridReady={this.onGridReady}
            onRowDataUpdated={this.onRowDataUpdated}
            deltaRowDataMode
            getRowNodeId={data => data.id}
          />
        </div>
      {this.state.invalidCells ? (
        <p>Invalid Cells: {this.state.invalidCells.map(({rowInd, field}) => (
          <span> rowIndex: {rowInd}, column: {field} </span>
        ))}</p>
      ): null}
      <button 
        disabled={this.state.invalidCells}
        style={{
            background: this.state.invalidCells ? 'grey' : 'blueviolet',
            color: this.state.invalidCells ? 'lightgrey' : 'white'
        }}
        >Submit</button>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
