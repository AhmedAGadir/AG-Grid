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

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    return (
      <div>
        <button
          style={{ margin: '10px' }}
          onClick={this.props.onToggleFloatingFilter}>{this.props.isFilterVisible ? 'hide filter' : 'show filter'}</button>
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
                isFilterVisible: this.props.isFilterVisible
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
            enableColResize={true} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    columnDefs: state.columnDefs,
    rowData: state.rowData,
    isFilterVisible: state.isFilterVisible
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitRowData: rowData => dispatch(actions.initRowData(rowData)),
    onToggleFloatingFilter: () => dispatch(actions.toggleFloatingFilter())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);