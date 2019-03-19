import React, { Component } from 'react';
import './MyDetailCellRenderer.css'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

// import { connect } from 'react-redux';
// import * as actions from './store/actions';

class MyDetailCellRenderer extends Component {

    componentDidMount() {
        console.log('componentDidMount', this.props);
    }

    onGridReady(params) {
        console.log('detail grid ready', params)
        var detailGridId = this.props.node.id;
        var gridInfo = {
            id: detailGridId,
            api: params.api,
            columnApi: params.columnApi
        }
        this.props.api.addDetailGridInfo(detailGridId, gridInfo);

        params.api.sizeColumnsToFit();
    }

    render() {
        return (
            <div style={{ padding: '30px', height: "100%" }}>
                <AgGridReact
                    columnDefs={[
                        { field: 'callId' },
                        { field: 'direction' },
                        { field: 'number' },
                        { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" },
                        { field: 'switchCode' }
                    ]}
                    rowData={this.props.data.callRecords}
                    onGridReady={this.onGridReady.bind(this)}
                >
                </AgGridReact>
            </div>
        )
    }
}

export default MyDetailCellRenderer;