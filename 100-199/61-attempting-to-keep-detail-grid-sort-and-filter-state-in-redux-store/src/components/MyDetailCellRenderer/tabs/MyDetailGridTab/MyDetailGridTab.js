import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

class MyDetailGridTab extends Component {

    constructor(props) {
        super(props);
        this.canSort = false;
        this.canFilter = false;
    }

    componentWillMount() {
        console.log('[componentWillMount]MyDetailGridTab')
        this.masterApi = this.props.api;
        this.masterNode = this.props.node
    }

    componentWillReceiveProps(nextProps) {
        console.log('[componentWillReceiveProp]MyDetailGridTab', nextProps)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tab !== this.props.tab) {
            this.initDetailRowHeight();

            this.canFilter = true
            let filterModel = this.props.rowData[this.masterIndex].detail[this.props.tab].filterModel;
            this.detailApi.setFilterModel(null);
            setTimeout(() => this.canFilter = false, 0);

            
            this.canSort = true;
            let sortModel = this.props.rowData[this.masterIndex].detail[this.props.tab].sortModel
            this.detailApi.setSortModel(sortModel);
            setTimeout(() => this.canSort = false, 0);
            
            
            this.detailApi.clearFocusedCell();
        }
    }

    onGridReady(params) {
        this.masterIndex = this.props.rowData.findIndex(row => row.id === this.props.data.id);
        this.detailApi = params.api;

        this.initSortModel();
        this.initFilterModel();
        this.initDetailRowHeight();
        this.detailApi.sizeColumnsToFit();
    }

    initSortModel() {
        let sortModel = this.props.rowData[this.masterIndex].detail[this.props.tab].sortModel;
        if (sortModel.length > 0) {
            this.canSort = true;
            this.detailApi.setSortModel(sortModel);
            setTimeout(() => this.canSort = false, 0);
        }
    }

    initFilterModel() {
        let filterModel = this.props.rowData[this.masterIndex].detail[this.props.tab].filterModel;
        if (Object.keys(filterModel).length > 0) {
            this.canFilter = true;
            this.detailApi.setFilterModel(filterModel);
            setTimeout(() => this.canFilter = false, 0);
        }
    }

    onSortChanged() {
        if (!this.canSort) {
            this.props.setSortModel(this.masterIndex, this.props.tab, this.detailApi.getSortModel());
        }
    }

    onFilterChanged() {
        if (!this.canFilter) {
            this.props.setFilterModel(this.masterIndex, this.props.tab, this.detailApi.getFilterModel());
        }
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
                onSortChanged={this.onSortChanged.bind(this)}
                onFilterChanged={this.onFilterChanged.bind(this)}
            >
            </AgGridReact>
        )
    }
}

export default MyDetailGridTab;