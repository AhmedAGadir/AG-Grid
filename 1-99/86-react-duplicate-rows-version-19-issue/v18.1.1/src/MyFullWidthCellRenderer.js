import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import MyGrid from './MyGrid';

class FullWidthCellRenderer extends Component {

    // componentWillReceiveProps = (nextProps) => {
    //     this.setState({ rowData: nextProps.rowData }, () => {
    //         //NO NEED TO DO THIS!
    //         this.gridApi.setRowData(nextProps.rowData);
    //     });
    // }

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        this.gridApi.sizeColumnsToFit();
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <button onClick={this.props.updateRowData}>update row data</button>
                <MyGrid rowDatas={this.props.data.rowDatas} />
            </div>
        );
    }

};

export default FullWidthCellRenderer;