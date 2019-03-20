import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

class myFirstDetailGridTab extends Component {
    state = {
        columnDefs: [
            { headerName: 'Detail Column 1', field: 'col1' },
            { headerName: 'Detail Column 2', field: 'col2' },
            { headerName: 'Detail Column 3', field: 'col3' }
        ],
        filterModel: null,
        sortModel: null,
    }

    onGridReady(params) {
        // var detailGridId = this.props.node.id;
        // var gridInfo = {
        //     id: detailGridId,
        //     api: params.api,
        //     columnApi: params.columnApi
        // }
        // this.props.api.addDetailGridInfo(detailGridId, gridInfo);

        params.api.sizeColumnsToFit();

        this.props.node.setRowHeight(this.calculateDetailRowHeight());
        this.props.api.onRowHeightChanged();
    }

    calculateDetailRowHeight() {
        if (this.props.node && this.props.node.detail) {
            var offset = 55; // 15px padding + 15px padding + 25px button row height
            var allDetailRowHeight = this.props.data.detailData.gridTab1Data.length * 25;
            var detailGridHeight = allDetailRowHeight + 28;
            console.log(detailGridHeight + offset)
            return detailGridHeight + offset;
        } else {
            return 60;
        }
    }

    render() {
        return (
            <AgGridReact
                columnDefs={this.state.columnDefs}
                defaultColDef={{
                    sortable: true,
                    filter: true,
                    editable: true,
                    cellEditor: 'agPopupTextCellEditor'
                }}
                rowData={this.props.data.detailData.gridTab1Data}
                onGridReady={this.onGridReady.bind(this)}
                deltaRowDataMode={true}
                deltaColumnMode={true}
                getRowNodeId={data => data.col1}
                domLayout="autoHeight"
            >
            </AgGridReact>
        )
    }
}

export default myFirstDetailGridTab;