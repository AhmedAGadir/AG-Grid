import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

class FullWidthCellRenderer extends Component {
    constructor(props) {
        super(props);
        console.log(props)
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi
    }

    render() {
        return (
            <div className="ag-theme-balham" style={{ width: '100vw', height: '100vh' }}>
                <AgGridReact
                    columnDefs={this.props.columnDefs}
                    rowData={this.props.data.callRecords}
                    onGridReady={this.onGridReady}
                />
            </div>
        );
    }

};

export default FullWidthCellRenderer;