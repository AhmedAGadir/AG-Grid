import React, { Component, Fragment } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';

import MyGroupCellRenderer from './components/MyGroupCellRenderer';
import MyDetailCellRenderer from './components/MyDetailCellRenderer/MyDetailCellRenderer';

class App extends Component {

  componentDidMount() {
    this.props.onInitRowData();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <Fragment>
        <button
          style={{ margin: '10px'}}
          className="btn btn-primary"
          onClick={() => console.log(this.props.rowData)}>Log All Row Data</button>
        <div
          className="ag-theme-balham"
          style={{
            height: '100vh',
          }}>
          <AgGridReact
            columnDefs={[
              {
                headerName: 'Expander',
                maxWidth: 100,
                cellRendererFramework: MyGroupCellRenderer
              },
              { headerName: 'Main Col1', field: 'mainCol1' },
              { headerName: 'Main Col2', field: 'mainCol2' },
            ]}
            masterDetail={true}
            detailCellRendererFramework={MyDetailCellRenderer}
            detailCellRendererParams={{
              rowData: this.props.rowData,
            }}
            rowData={this.props.rowData}
            defaultColDef={{ width: 150 }}
            onGridReady={this.onGridReady.bind(this)}
            deltaRowDataMode={true}
            getRowNodeId={data => data.id}>
          </AgGridReact>
        </div >
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    rowData: state.rowData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitRowData: () => dispatch(actions.initRowData()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);