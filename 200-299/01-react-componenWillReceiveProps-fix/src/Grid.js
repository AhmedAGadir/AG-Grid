import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export default class Grid extends Component {

    static propTypes = {
        rows: PropTypes.array,
        columns: PropTypes.array,

        loading: PropTypes.bool,
        error: PropTypes.object

    };

    static defaultProps = {
        rows: [],
        columns: []
    };

    // componentWillReceiveProps(nextProps, nextContext) {
    //     // cWRP receives the new rowData just moments before the grid does,
    //     // so whatever happens here is quickly overrun when the grid actually processes the new rows

    //     // this is whats happening:
    //     // onLoadBtnClicked: [Host.js] setState(row: null) -> [Grid.js cWRP] showLoadingOverlay -> [AgGridReact] {rows: null} + showNoRowsOverlay etc. 

    //     // the better thing to do is to hook up what you would like to the grids callbacks e.g. onRowDataUpdated

    //     if (!this.gridApi) {
    //         return;
    //     }

    //     console.log('componentWillReceiveProps', 'loading: ' + nextProps.loading, 'error: ' + nextProps.error)

    //     if (nextProps.loading) {
    //         this.gridApi.showLoadingOverlay();
    //     } else if (nextProps.error) {
    //         this.gridApi.showNoRowsOverlay();
    //     }
    // }

    onRowDataUpdated = params => {
        console.log('rowDataUpdated', 'loading: ' + this.props.loading, 'error: ' + this.props.error)

        if (this.props.loading) {
            this.gridApi.showLoadingOverlay();
        } else if (this.props.error) {
            this.gridApi.showNoRowsOverlay();
        }
    };

    onGridReady = (params) => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
    };

    render() {

        const { rows, columns } = this.props;

        return (
            <div
                className='grid-container'
                style={{ display: 'flex', width: '100%', height: '100%' }}
            >
                <div
                    className='ag-theme-balham'
                    style={{ height: '800px', width: '100%' }}
                >
                    <AgGridReact
                        suppressAggFuncInHeader={true}
                        columnDefs={columns}
                        onGridReady={(params) => this.onGridReady(params)}
                        rowData={rows}
                        enableSorting={true}
                        enableFilter={true}
                        animateRows={true}
                        enableColResize={true}
                        suppressCellSelection={true}
                        rowSelection="single"
                        // also you should use deltaRowDataMode so that the grids api is bound to your state
                        deltaRowDataMode
                        getRowNodeId={data => data.orgName}
                        onRowDataUpdated={this.onRowDataUpdated}
                    />
                </div>
            </div>)
            ;
    }
}
