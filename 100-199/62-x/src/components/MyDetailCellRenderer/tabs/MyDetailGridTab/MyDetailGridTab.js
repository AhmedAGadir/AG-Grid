import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

class MyDetailGridTab extends Component {
    componentWillMount() {
        this.masterApi = this.props.api;
        this.masterNode = this.props.node
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tab !== this.props.tab) {
            this.initDetailRowHeight();
            this.detailApi.setFilterModel(null);
            this.detailApi.setSortModel(null);
            this.detailApi.clearFocusedCell();
        }
    }

    onGridReady(params) {
        this.masterIndex = this.props.rowData.findIndex(row => row.id === this.props.data.id);
        this.detailApi = params.api

        this.initDetailRowHeight();
        this.detailApi.sizeColumnsToFit();
    }

    initDetailRowHeight() {
        let offset = 60; // 15px padding + 15px padding + 30px button row height
        let numberDetailOfRows = 0
        this.detailApi.forEachNodeAfterFilter(node => numberDetailOfRows++);
        let innerGridHeight = (numberDetailOfRows * 25) + 28; // 28px for the header height
        if (numberDetailOfRows === 0) {
            innerGridHeight = 75;
        }
        let height =  innerGridHeight + offset;
        this.props.setDetailRowHeight(height);
    }

    onFilterChanged() {
        this.initDetailRowHeight();
    }

    render() {
        return (
            <AgGridReact
                columnDefs={[
                    { headerName: 'Detail Column 1', field: 'col1' },
                    { headerName: 'Detail Column 2', field: 'col2' },
                    { headerName: 'Detail Column 3', field: 'col3' }
                ]}
                defaultColDef={{
                    sortable: true,
                    filter: true,
                    editable: true,
                    cellEditor: 'agPopupTextCellEditor'
                }}
                rowData={this.props.gridParams.data}
                rowHeight={25}
                onGridReady={this.onGridReady.bind(this)}
                deltaRowDataMode={true}
                getRowNodeId={data => data.id}
                domLayout="autoHeight"
                onFilterChanged={this.onFilterChanged.bind(this)}
            >
            </AgGridReact>
        )
    }
}

export default MyDetailGridTab;