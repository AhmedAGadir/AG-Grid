import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

class MyFirstDetailGridTab extends Component {

    constructor(props) {
        super(props);
        this.sortingFromInit = false;
        this.filteringFromInit = false;
    }

    componentWillMount() {
        console.log('componentWillMount', 'myFirstDetailGridTab')
        this.masterApi = this.props.api;
        this.masterNode = this.props.node
    }

    shouldComponentUpdate(nextProps) {
        // console.log('shouldComponentUpdate', 'myFirstDetailGridTab')
    }

    onGridReady(params) {
        // console.log('onGridReady', params.api.getSortModel(), params.api.getFilterModel());





        // how is this gonna work with 2 subgrids ? 

        var detailGridId = this.masterNode.id;
        var gridInfo = {
            id: detailGridId,
            api: params.api,
            columnApi: params.columnApi
        }
        this.masterApi.addDetailGridInfo(detailGridId, gridInfo);






        this.masterIndex = this.props.rowData.findIndex(row => row.id === this.props.data.id);
        this.detailApi = params.api

        this.masterNode.setRowHeight(this.calculateDetailRowHeight());
        this.masterApi.onRowHeightChanged();

        this.initSortModel();
        this.initFilterModel();

        this.detailApi.sizeColumnsToFit();
    }

    initSortModel() {
        let sortModel = this.props.rowData[this.masterIndex].detail.gridTab1.sortModel;
        console.log(this.props.rowData)
        console.log('sort', sortModel)
        if (sortModel.length > 0) {
            this.sortingFromInit = true;
            this.detailApi.setSortModel(sortModel);
            setTimeout(() => this.sortingFromInit = false, 0);
        }
    }

    initFilterModel() {
        let filterModel = this.props.rowData[this.masterIndex].detail.gridTab1.filterModel;
        console.log('filter', filterModel)
        if (Object.keys(filterModel).length > 0) {
            this.filteringFromInit = true;
            this.detailApi.setFilterModel(filterModel);
            setTimeout(() => this.filteringFromInit = false, 0);
        }
    }

    onSortChanged() {
        if (!this.sortingFromInit) {
            console.log('setting up reduxs sort', this.detailApi.getSortModel());
            this.props.setSortModel(this.masterIndex, 'gridTab1', this.detailApi.getSortModel());
        }
    }

    onFilterChanged() {
        if (!this.filteringFromInit) {
            console.log('setting up reduxs filter', this.detailApi.getFilterModel());
            this.props.setFilterModel(this.masterIndex, 'gridTab1', this.detailApi.getFilterModel());
        }
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

export default MyFirstDetailGridTab;