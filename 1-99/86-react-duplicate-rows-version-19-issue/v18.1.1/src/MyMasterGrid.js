import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import MyFullWidthCellRenderer from './MyFullWidthCellRenderer';

class MyMasterGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                {
                    field: "name",
                }
            ],
            rowData: [
                {
                    name: 'old master',
                    id: 'oldMaster'
                },
                {
                    name: 'old detail',
                    id: 'oldDetail',
                    rowDatas: [{
                        test: 'from the old master'
                    }]
                }
            ]
        };
    };

    updateDetailRowData = () => {
        const rowDataCopy = this.state.rowData.map(row => ({
            ...row,
            rowDatas: row.rowDatas ? row.rowDatas.map(rD => ({ ...rD })) : undefined
        }));
        rowDataCopy[1].rowDatas[0].test = 'from button click';

        this.setState(() => ({
            rowData: rowDataCopy
        }), () => {
            this.gridApi.setRowData(rowDataCopy)
        })
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        this.gridApi.sizeColumnsToFit();
    }

    doesDataFlower = (data) => {
        return data.id === 'oldMaster';
    }

    isFullWidthCell = node => {
        return node.data.id === 'oldDetail';
    }

    getRowHeight = params => {
        return params.node.data.id === 'oldDetail' ? 200 : 25
    }

    getRowNodeId = data => {
        return data.id;
    }


    render() {
        console.log('rendering main grid', this.state)
        return (
            <div className="ag-theme-balham" style={{ width: '100vw', height: '100vh' }}>
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    onGridReady={this.onGridReady}
                    doesDataFlower={this.doesDataFlower}
                    isFullWidthCell={this.isFullWidthCell}
                    fullWidthCellRendererFramework={MyFullWidthCellRenderer}
                    fullWidthCellRendererParams={{
                        updateRowData: this.updateDetailRowData,
                    }}
                    getRowHeight={this.getRowHeight}
                    getRowNodeId={this.getRowNodeId}
                    deltaRowDataMode={true}
                    rememberGroupStateWhenNewData
                    suppressColumnVirtualisation
                />
            </div>
        );
    }
}

export default MyMasterGrid;