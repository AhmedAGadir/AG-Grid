// The cellRenderParams object is only instantiated once, so the number value referred to in the callback is never updated upon subsequent re-renders of the application

// /******** problem ********/

// let a = { 
//     value: 1 
// }

// let closure = () => { 
//     let b = a.value; 
//     let innerCallback = () => console.log(a.value); 
//     return innerCallback 
// }

// let innnerCallback = closure()

// innerCallback() // 1

// a.value = 2

// innerCallback() //  1


// /******** solution ********/

// let a = { 
//     value: 1 
// }

// let closure = () => { 
//     let b = a; 
//     let innerCallback = () => console.log(b.value); 
//     return innerCallback 
// }

// let innnerCallback = closure()

// innerCallback() // 1

// a.value = 2

// innerCallback() //  2

// =====================================================================

"use strict";

import React, { Component } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import ChildMessageRenderer from "./childMessageRenderer.jsx";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number: 0,
      rowData: createRowData(),
      context: { componentParent: this },
      frameworkComponents: {
        childMessageRenderer: ChildMessageRenderer
      }
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  
  onGridSizeChanged(params) {
    params.api.sizeColumnsToFit();
  }
  
  render() {
    const { number } = this.state;
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div style={{ height: "100%", boxSizing: "border-box" }}>
          <div
            id="myGrid"
            style={{
              boxSizing: "border-box",
              height: "100%",
              width: "100%"
            }}
            className="ag-theme-balham"
          >
            <AgGridReact
              columnDefs={[
                {
                  headerName: "Row",
                  field: "row",
                  width: 150
                },
                {
                  headerName: "Child/Parent",
                  field: "value",
                  cellRenderer: "childMessageRenderer",
                  cellRendererParams: {
                    callback: () => {
                      // console.log('CALLBACK NUMBER', number);
                      // this.setState({ number: this.state.number + 1 });

                      console.log('CALLBACK NUMBER', this.state.number);
                      this.setState(prevState => ({ number: prevState.number + 1 }))
                    }
                  },
                  colId: "params",
                  width: 180
                }
      ]}
              rowData={this.state.rowData}
              context={this.state.context}
              frameworkComponents={this.state.frameworkComponents}
              onGridReady={this.onGridReady.bind(this)}
              onGridSizeChanged={this.onGridSizeChanged.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

function createRowData() {
  var rowData = [];
  for (var i = 0; i < 15; i++) {
    rowData.push({
      row: "Row " + i,
      value: i,
      currency: i + Number(Math.random().toFixed(2))
    });
  }
  return rowData;
}

render(<GridExample />, document.querySelector("#root"));
