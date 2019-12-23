import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from '@ag-grid-community/react';
import {AllModules} from "@ag-grid-enterprise/all-modules";

import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham.css";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "Make", field: "make"
        }, {
          headerName: "Model", field: "model"
        }, {
          headerName: "Price", field: "price"
        }
      ],
      rowData: [
        {
          make: "Toyota", model: "Celica", price: 35000
        }, {
          make: "Ford", model: "Mondeo", price: 32000
        }, {
          make: "Porsche", model: "Boxter", price: 72000
        }
      ]
    }
  }

  render() {
    return (
      <div 
        className="ag-theme-balham"
        style={{ 
        height: '500px', 
        width: '600px' }} 
      >
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          modules={AllModules}>
        </AgGridReact>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
