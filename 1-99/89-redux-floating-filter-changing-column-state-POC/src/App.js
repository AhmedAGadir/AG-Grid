import React, { Component } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';
import uuidv4 from 'uuid';
import MyCustomFloatingFilter from './MyCustomFloatingFilter';

class App extends Component {

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json')
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
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{ height: '100vh', }}>
        <AgGridReact
          columnDefs={this.props.columnDefs}
          defaultColDef={{
            width: 150,
            sortable: true,
            filter: 'agTextColumnFilter',
            floatingFilterComponent: 'myCustomFloatingFilter',
            floatingFilterComponentParams: {
              suppressFilterButton: true,
              toggleFloatingFilter: this.props.onToggleFloatingFilter
            }
          }}
          frameworkComponents={{
            myCustomFloatingFilter: MyCustomFloatingFilter
          }}
          rowData={this.props.rowData}
          onGridReady={this.onGridReady}
          getRowNodeId={data => data.id}
          deltaRowDataMode={true}
          floatingFilter={true}
          enableColResize={true}
          suppressPropertyNamesCheck={true} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    columnDefs: state.columnDefs,
    rowData: state.rowData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitRowData: rowData => dispatch(actions.initRowData(rowData)),
    onToggleFloatingFilter: (columnApi, column) => dispatch(actions.toggleFloatingFilter(columnApi, column))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);