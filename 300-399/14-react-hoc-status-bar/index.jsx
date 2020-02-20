"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "@ag-grid-community/react";
import { AllModules } from "@ag-grid-enterprise/all-modules";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css";
import ClickableStatusBarComponent from "./clickableStatusBarComponent.jsx";

function higherOrderComponent(WrappedComponent) {
  
  return class extends Component {
    constructor(props) {
      super(props);
    }

    componentDidMount() {
      console.log('componentDidMount')
    }

    componentDidUnmount() {
      console.log('componentDidUnmount')
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modules: AllModules,
      columnDefs: [
        {
          headerName: "Row",
          field: "row"
        },
        {
          headerName: "Name",
          field: "name"
        }
      ],
      rowData: createRowData(),
      rowSelection: "multiple",
      frameworkComponents: {
        clickableStatusBarComponent: higherOrderComponent(ClickableStatusBarComponent),
      },
      statusBar: {
        statusPanels: [
          { statusPanel: "clickableStatusBarComponent" },
        ]
      }
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          id="myGrid"
          style={{
            height: "100%",
            width: "100%"
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            modules={this.state.modules}
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            enableRangeSelection={true}
            rowSelection={this.state.rowSelection}
            frameworkComponents={this.state.frameworkComponents}
            statusBar={this.state.statusBar}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    );
  }
}

function createRowData() {
  return [
    {
      row: "Row 1",
      name: "Michael Phelps"
    },
    {
      row: "Row 2",
      name: "Natalie Coughlin"
    },
    {
      row: "Row 3",
      name: "Aleksey Nemov"
    },
    {
      row: "Row 4",
      name: "Alicia Coutts"
    },
    {
      row: "Row 5",
      name: "Missy Franklin"
    },
    {
      row: "Row 6",
      name: "Ryan Lochte"
    },
    {
      row: "Row 7",
      name: "Allison Schmitt"
    },
    {
      row: "Row 8",
      name: "Natalie Coughlin"
    },
    {
      row: "Row 9",
      name: "Ian Thorpe"
    },
    {
      row: "Row 10",
      name: "Bob Mill"
    },
    {
      row: "Row 11",
      name: "Willy Walsh"
    },
    {
      row: "Row 12",
      name: "Sarah McCoy"
    },
    {
      row: "Row 13",
      name: "Jane Jack"
    },
    {
      row: "Row 14",
      name: "Tina Wills"
    }
  ];
}

render(<GridExample></GridExample>, document.querySelector("#root"));
