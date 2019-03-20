import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

class myFirstDetailGridTab extends Component {
    onGridReady(params) {
        // var detailGridId = this.props.node.id;
        // var gridInfo = {
        //     id: detailGridId,
        //     api: params.api,
        //     columnApi: params.columnApi
        // }
        // this.props.api.addDetailGridInfo(detailGridId, gridInfo);


        // var sortModel = this.props.getSortModel('gridTab1', this.props.rowIndex);
        // if (sortModel) {
        //     params.api.setSortModel(sortModel);
        // }

        // var filterModel = this.props.getFilterModel('gridTab1', this.props.rowIndex);
        // if (filterModel) {
        //     params.api.setFilterModel(filterModel);
        // }

        this.props.node.setRowHeight(this.calculateDetailRowHeight());
        this.props.api.onRowHeightChanged();

        params.api.sizeColumnsToFit();
    }

    onSortChanged(params) {
        this.props.setSortModel('gridTab1', params.api.getSortModel());
    }

    onFilterChanged(params) {
        this.props.setFilterModel('gridTab1', params.api.getFilterModel());
    }

    calculateDetailRowHeight() {
        if (this.props.node && this.props.node.detail) {
            var offset = 55; // 15px padding + 15px padding + 25px button row height
            var allDetailRowHeight = this.props.data.detailData.gridTab1Data.length * 25;
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
                rowData={this.props.data.detailData.gridTab1Data}
                onGridReady={this.onGridReady.bind(this)}
                deltaRowDataMode={true}
                getRowNodeId={data => data.col1}
                domLayout="autoHeight"
                onSortChanged={this.onSortChanged.bind(this)}
                onFilterChanged={this.onFilterChanged.bind(this)}
            >
            </AgGridReact>
        )
    }
}

export default myFirstDetailGridTab;