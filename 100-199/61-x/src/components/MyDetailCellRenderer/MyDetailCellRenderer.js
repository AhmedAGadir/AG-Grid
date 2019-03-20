import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import './MyDetailCellRenderer.css'

class MyDetailCellRenderer extends Component {

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

    render() {
        return (
            <div className="detail-cell-renderer">
                <div>
                    <button>Grid Tab 1</button>
                    <button>Non Grid Tab</button>
                    <button>Grid Tab 2</button>
                    <button>Nested Component Tab</button>
                </div>
                <div>
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

export default MyDetailCellRenderer;