import React, { Component } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';
import uuidv4 from 'uuid';

import MyGroupCellRenderer from './components/MyGroupCellRenderer';
import MyDetailCellRenderer from './components/MyDetailCellRenderer/MyDetailCellRenderer';

class App extends Component {

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/simple/data/data.json')
      .then(res => res.json())
      .then(data => {
        data.forEach(d => d.id = uuidv4())
        this.props.onInitRowData(data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: '90vh',
        }}>
        <AgGridReact
          columnDefs={[
            {
              headerName: 'Expander',
              maxWidth: 100,
              cellRendererFramework: MyGroupCellRenderer
            },
            { field: 'name' },
            { field: 'account' },
            { field: 'calls' },
            { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" }
          ]}
          masterDetail={true}
          detailCellRendererFramework={MyDetailCellRenderer}
          rowData={this.props.rowData}
          defaultColDef={{ width: 150 }}
          onGridReady={this.onGridReady.bind(this)}
          deltaRowDataMode={true}
          getRowNodeId={data => data.id}>
        </AgGridReact>
      </div >
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
    onInitRowData: rowData => dispatch(actions.initRowData(rowData)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);