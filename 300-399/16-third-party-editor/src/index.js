import React, { Component } from "react";
import ReactDOM from "react-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-balham.css";
import "./styles.css";
import Picky from "react-picky";
import "react-picky/dist/picky.css";

class PickyRender extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptions: { value: 1, label: 1 },
      selectOptions: [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 }
      ]
    };
  }

  getValue = () => {
    return this.state.selectedOptions.value;
  };

  selectMultipleOption = value => {
    this.setState({
      selectedOptions: value
    });
  };

  isPopup = () => true;
  

  render() {
    return (
      <Picky
        value={this.state.selectedOptions}
        options={this.state.selectOptions}
        onChange={this.selectMultipleOption}
        className="ag-custom-component-popup"
        open={false}
        valueKey="value"
        labelKey="label"
        multiple={true}
      />
    );
  }
}

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: "a",
          width: 150
        },
        {
          field: "b",
          width: 150,
          editable: true,
          cellEditor: "pickyRender"
        },
        {
          field: "c",
          width: 150
        },
        {
          field: "d",
          width: 150
        },
        {
          field: "e",
          width: 150
        }
      ],
      frameworkComponents: {
        pickyRender: PickyRender
      },
      rowData: [
        { a: 1, b: "this cell", c: 1, d: 1, e: 1 },
        { a: 2, b: "this cell", c: 2, d: 2, e: 2 },
        { a: 3, b: "this cell", c: 3, d: 3, e: 3 },
        { a: 4, b: "this cell", c: 4, d: 4, e: 4 },
        { a: 5, b: "this cell", c: 5, d: 5, e: 5 }
      ]
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div className="grid-wrapper">
          <div
            id="myGrid"
            style={{
              boxSizing: "border-box",
              height: "100vh",
              width: "100%"
            }}
            className="ag-theme-balham"
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              onGridReady={this.onGridReady.bind(this)}
              rowHeight={100}
              frameworkComponents={this.state.frameworkComponents}
              rowData={this.state.rowData}
              popupParent={document.body}
            />
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" }
      ],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }
      ]
    };
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: "500px",
          width: "600px"
        }}
      >
        <PickyRender />

        <GridExample />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
