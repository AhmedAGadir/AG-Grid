import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

class MyDetailGridTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: []
        };
        this.masterApi = this.props.api;
        this.masterNode = this.props.node;
    }

    componentDidMount() {
        this.updateColumnDefs();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tab !== this.props.tab) {
            this.updateColumnDefs();
            this.detailApi.setFilterModel(null);
            this.detailApi.setSortModel(null);
            this.detailApi.clearFocusedCell();
        }
    }

    updateColumnDefs() {
        let columnDefs;
        switch (this.props.tab) {
            case 'contacts':
                columnDefs = [
                    { field: "custID" },
                    { field: "custType" },
                    { field: "lastName" },
                    { field: "firstName" },
                    { field: "email" },
                    { field: "phone" },
                    { field: "fax" },
                    { field: "street" },
                    { field: "city" },
                    { field: "state" },
                    { field: "country" },
                    { field: "postalCode" },
                    { field: "notes" },
                ];
                break;
            case 'profileRespApis':
                columnDefs = [
                    { field: "profileName" },
                    { field: "dValue" },
                    { field: "dValues" },
                    { field: "description" },
                ]
                break;
            default:
                columnDefs = null
        }
        this.setState({ columnDefs })
    }

    onGridReady(params) {
        this.detailApi = params.api
    }

    onGridColumnsChanged(params) {
        params.api.sizeColumnsToFit();
    }

    render() {
        return (
            <AgGridReact
                columnDefs={this.state.columnDefs}
                defaultColDef={{
                    editable: true,
                    sortable: true,
                    filter: true
                }}
                rowData={this.props.rowData}
                onGridReady={this.onGridReady.bind(this)}
                deltaRowDataMode={true}
                getRowNodeId={data => data.id}
                deltaColumnMode={true}
                onGridColumnsChanged={this.onGridColumnsChanged.bind(this)}
            >
            </AgGridReact >
        )
    }
}

export default MyDetailGridTab;