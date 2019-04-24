"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './style.css';

import CellRenderer from "./CellRenderer.jsx";
import Button from '@material-ui/core/Button';



class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rowData: null,
      columnDefs: [
        {
          field: "id"
        },
        {
          cellRenderer: 'cellRenderer',
          field: "price"
        }
      ],
    };
    this.idSequence = 0;
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.setState({ rowData: this.getInitialData() });
  };

  getInitialData() {
    let data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        id: this.idSequence++,
        price: Math.floor(Math.random() * 100)
      });
    }
    return data;
  }

  updatePrices() {
    var updatedRowData = this.state.rowData.map(row => ({
      id: row.id,
      price: Math.floor(Math.random() * 100)
    }));
    this.setState({ rowData: updatedRowData })
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", paddingTop: "70px", boxSizing: "border-box" }}>
          <div
            id="myGrid"
            style={{
              height: "100%",
              width: "100%"
            }}
            className="ag-theme-balham"
          >
            <AgGridReact
              reactNext={true}
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              deltaRowDataMode={true}
              getRowNodeId={data => data.id}
              onGridReady={this.onGridReady}
              animateRows={true}
              frameworkComponents={{
                cellRenderer: CellRenderer
              }}
            />
          </div>
        </div>

        <div style={{ position: "absolute", top: "0", left: "0" }}>
          <Button variant="contained" color="primary" onClick={this.updatePrices.bind(this)}>Update Prices</Button>
        </div>
      </div>
    );
  }
}

render(<GridExample />, document.querySelector("#root"));
