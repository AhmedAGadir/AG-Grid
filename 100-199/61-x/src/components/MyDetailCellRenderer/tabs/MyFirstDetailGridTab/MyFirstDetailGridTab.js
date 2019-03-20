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

        params.api.sizeColumnsToFit();
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
                    editable: true
                }}
                rowData={this.props.rowData}
                onGridReady={this.onGridReady.bind(this)}
                deltaRowDataMode={true}
                getRowNodeId={data => data.col1}
            >
            </AgGridReact>
        )
    }
}

export default myFirstDetailGridTab;