import React, { Component } from 'react';
import MyDetailGrid from './MyDetailGrid';

class MyFullWidthCellRenderer extends Component {

    // componentWillReceiveProps = (nextProps) => {
    //     this.setState({ rowData: nextProps.rowData }, () => {
    //         //NO NEED TO DO THIS!
    //         this.gridApi.setRowData(nextProps.rowData);
    //     });
    // }

    // onGridReady = params => {
    //     this.gridApi = params.api;
    //     this.columnApi = params.columnApi;

    //     this.gridApi.sizeColumnsToFit();
    // }

    render() {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <button onClick={this.props.updateRowData}>update row data</button>
                <MyDetailGrid rowDatas={this.props.data.rowDatas} />
            </div>
        );
    }

};

export default MyFullWidthCellRenderer;