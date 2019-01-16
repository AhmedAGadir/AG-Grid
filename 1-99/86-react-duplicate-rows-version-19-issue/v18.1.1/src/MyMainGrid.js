import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import MySubGrid from './MySubGrid';

class MyMainGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                {
                    field: "name",
                    cellRenderer: "agGroupCellRenderer"
                },
                { field: "account" },
                { field: "calls" },
                {
                    field: "minutes",
                    valueFormatter: "x.toLocaleString() + 'm'"
                }
            ],
            rowData: null,
            fullWidthCellRendererParams: {
                columnDefs: [
                    { field: "callId" },
                    { field: "direction" },
                    { field: "number" },
                    {
                        field: "duration",
                        valueFormatter: "x.toLocaleString() + 's'"
                    },
                    { field: "switchCode" }
                ]
            }
        };
    };

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;

        fetch("https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/simple/data/data.json")
            .then(res => res.json())
            .then(data => {
                params.api.setRowData(data);
            })
            .catch(err => {
                console.log(err)
            })

        this.gridApi.sizeColumnsToFit();
    }

    doesDataFlower = () => {
        return true
    }

    isFullWidthCell = node => {
        return node.flower;
    }

    getRowHeight = params => {
        return params.node.level === 1 ? 200 : 25
    }

    getRowNodeId = data => {
        ;
        return data.account;
    }


    render() {
        return (
            <div className="ag-theme-balham" style={{ width: '100vw', height: '100vh' }}>
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    onGridReady={this.onGridReady}
                    doesDataFlower={this.doesDataFlower}
                    isFullWidthCell={this.isFullWidthCell}
                    fullWidthCellRendererFramework={MySubGrid}
                    fullWidthCellRendererParams={this.state.fullWidthCellRendererParams}
                    getRowHeight={this.getRowHeight}
                    getRowNodeId={this.getRowNodeId}
                    deltaRowDataMode={true}
                />
            </div>
        );
    }
}

export default MyMainGrid;