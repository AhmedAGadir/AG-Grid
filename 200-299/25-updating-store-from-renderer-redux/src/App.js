import React, { Component } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';

import NameCellRenderer from './NameCellRenderer';

class App extends Component {

  componentDidMount() {
    let rowData = [
      { name: 'Jack', id: 1 },
      { name: 'Jill', id: 2 },
      { name: 'Bob', id: 3 }
    ];
    this.props.onInitRowData(rowData);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
              field: 'name',
              cellRendererFramework: NameCellRenderer,
              cellRendererParams: {
                changeName: this.props.onNameChanged
              }
            },
          ]}
          rowData={this.props.rowData}
          defaultColDef={{ width: 150 }}
          onGridReady={this.onGridReady.bind(this)}
          deltaRowDataMode={true}
          getRowNodeId={data => data.id}>
        </AgGridReact>
      </div>
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
    onNameChanged: (name, rowInd) => dispatch(actions.updateName(name, rowInd))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);