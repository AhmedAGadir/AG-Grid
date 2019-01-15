import React, { Component } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                { headerName: "Make", field: "make" },
                { headerName: "Model", field: "model" },
                { headerName: "Price", field: "price" }

            ],
            rowData: null
        }
    }

    componentDidMount() {
        fetch('https://api.myjson.com/bins/15psn9')
            .then(result => result.json())
            .then(rowData => this.setState({ rowData }))
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        // add grid container keydown event listeners
        // hide overlay ? 
        // set column defs
        // set row data
        // refresh cells ? just use delta row 
        //highlight new object 
    }

    render() {
        return (
            <div
                className="ag-theme-balham"
                style={{
                    height: '500px',
                    width: '600px'
                }}
            >
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    //getContextMenuItems  
                    showToolPanel={false}
                    enableSorting
                    enableColResize
                    enableFilter
                    rowGroupPanelShow // ***
                    onGridReady={this.onGridReady}
                >
                </AgGridReact>
            </div>
        );
    }
}

export default App;