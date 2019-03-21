import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

class myFirstDetailGridTab extends Component {

    componentWillMount() {
        this.masterApi = this.props.api;
        this.masterNode = this.props.node

    }

    onGridReady(params) {
        console.log('onGridReady')
        // var detailGridId = this.props.node.id;
        // var gridInfo = {
        //     id: detailGridId,
        //     api: params.api,
        //     columnApi: params.columnApi
        // }
        // this.masterApi.addDetailGridInfo(detailGridId, gridInfo);

        this.masterIndex = this.props.rowData.findIndex(row => row.id === this.props.data.id);
        this.detailApi = params.api

        this.masterNode.setRowHeight(this.calculateDetailRowHeight());
        this.masterApi.onRowHeightChanged();

        this.initSortModel();
        this.initFilterModel();

        this.detailApi.sizeColumnsToFit();
    }

    initSortModel() {
        console.log('initSortModel')
        let sortModel = this.props.rowData[this.masterIndex].detail.gridTab1.sortModel;
        if (sortModel) {
            console.log(sortModel)
            this.detailApi.setSortModel(sortModel);
        }
    }

    initFilterModel() {
        console.log('initFilterModel')
        let filterModel = this.props.rowData[this.masterIndex].detail.gridTab1.filterModel;
        if (filterModel) {
            console.log(filterModel)
            this.detailApi.setFilterModel(filterModel);
        }
    }

    onSortChanged() {
        console.log('onSortChanged')
        this.props.setSortModel(this.masterIndex, 'gridTab1', this.detailApi.getSortModel());
    }

    onFilterChanged() {
        console.log('onFilterChanged')
        this.props.setFilterModel(this.masterIndex, 'gridTab1', this.detailApi.getFilterModel());
    }

    calculateDetailRowHeight() {
        if (this.masterNode && this.masterNode.detail) {
            var offset = 55; // 15px padding + 15px padding + 25px button row height
            var allDetailRowHeight = this.props.gridParams.data.length * 25;
            var detailGridHeight = allDetailRowHeight + 28;
            return detailGridHeight + offset;
        } else {
            return 60;
        }
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
                onGridReady={this.onGridReady.bind(this)}
                deltaRowDataMode={true}
                getRowNodeId={data => data.id}
                domLayout="autoHeight"
                onSortChanged={this.onSortChanged.bind(this)}
                onFilterChanged={this.onFilterChanged.bind(this)}
            >
            </AgGridReact>
        )
    }
}

export default myFirstDetailGridTab;