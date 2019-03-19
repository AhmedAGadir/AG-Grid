import React, { Component } from 'react';
import './MyDetailCellRenderer.css'

import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-balham.css';
// import 'ag-grid-enterprise';

import { connect } from 'react-redux';
// import * as actions from './store/actions';

class MyDetailCellRenderer extends Component {

    componentDidMount() {
    }

    onGridReady(params) {
        var detailGridId = this.props.node.id;
        var gridInfo = {
            id: detailGridId,
            api: params.api,
            columnApi: params.columnApi
        }
        this.props.api.addDetailGridInfo(detailGridId, gridInfo);

        params.api.sizeColumnsToFit();
    }

    logRowData() {
        console.log(this.props.rowData);
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                <button onClick={this.logRowData.bind(this)}>Log Row Data</button>
                <div style={{ padding: '30px', height: "100%" }}>
                    <AgGridReact
                        columnDefs={[
                            { field: 'callId', editable: true },
                            { field: 'direction' },
                            { field: 'number' },
                            { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" },
                            { field: 'switchCode' }
                        ]}
                        rowData={this.props.data.callRecords}
                        onGridReady={this.onGridReady.bind(this)}
                        deltaRowDataMode={true}
                        getRowNodeId={data => data.callId}
                    >
                    </AgGridReact>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        rowData: state.rowData
    }
}

export default connect(mapStateToProps)(MyDetailCellRenderer);