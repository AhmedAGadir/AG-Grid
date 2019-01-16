import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

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
            <div>
                <button onClick={this.props.updateRowData}>update row data</button>
                <div className="ag-theme-balham testings" style={{
                    width: '90%',
                    height: '190px',
                    margin: '5px auto'
                }}>
                    <AgGridReact
                        columnDefs={this.props.columnDefs}
                        rowData={this.props.data.callRecords}
                        onGridReady={this.onGridReady} />
                </div>
            </div>
        );
    }

};

export default FullWidthCellRenderer;