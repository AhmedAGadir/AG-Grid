import React, { Component, Fragment } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'redux';
import * as actions from './store/actions';

class App extends Component {

  // componentDidMount() {
  //   fetch('https://api.myjson.com/bins/15psn9')
  //     .then(result => result.json())
  //     .then(rowData => this.setState({ rowData }))
  // }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onUpdate1Row = () => {
    console.time('[UPDATE_1_ROW]');
    const newStore = this.props.rowData.map(data => ({ ...data }));
    for (let i = 0; i < 1; i++) {
      const randInd = Math.floor(Math.random() * newStore.length);
      newStore[randInd].age += this.randomSeed();
    }
    this.gridApi.setRowData(newStore);
    console.timeEnd('[UPDATE_1_ROW]');
  }

  onDelete1Row = () => {
    console.time('[DELETE_1_ROW]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 1; i++) {
      const randInd = Math.floor(Math.random() * newStore.length);
      newStore.splice(randInd, 1);
    }
    this.gridApi.setRowData(newStore)
    console.timeEnd('[DELETE_1_ROW]');
  }

  onAdd1Row = () => {
    console.time('[ADD_1_ROW]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 1; i++) {
      const randInd = Math.floor(Math.random() * newStore.length);
      newStore.push({
        ...newStore[randInd],
        symbol: createUniqueRandomSymbol()
      })
    }
    this.gridApi.setRowData(newStore)
    console.timeEnd('[ADD_1_ROW]');
  }

  onUpdate100Rows = () => {
    console.time('[UPDATE_100_ROWS]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 100; i++) {
      const randInd = Math.floor(Math.random() * newStore.length);
      newStore[randInd].age += this.randomSeed();
    }
    this.gridApi.setRowData(newStore);
    console.timeEnd('[UPDATE_100_ROWS]');
  }

  onDelete100Rows = () => {
    console.time('[DELETE_100_ROWS]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 100; i++) {
      const randInd = Math.floor(Math.random() * newStore.length);
      newStore.splice(randInd, 1);
    }
    this.gridApi.setRowData(newStore)
    console.timeEnd('[DELETE_100_ROWS]');
  }

  onAdd100Rows = () => {
    console.time('[ADD_100_ROWS]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 100; i++) {
      const randInd = Math.floor(Math.random() * newStore.length);
      newStore.push({
        ...newStore[randInd],
        symbol: this.createUniqueRandomSymbol()
      })
    }
    this.gridApi.setRowData(newStore)
    console.timeEnd('[ADD_100_ROWS]');
  }

  getRandomSeed() {
    return Math.floor(Math.random() * 4) + 1;
  }


  createUniqueRandomSymbol() {
    var symbol;
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var isUnique = false;
    while (!isUnique) {
      symbol = '';
      // create symbol
      for (var i = 0; i < 10; i++) {
        symbol += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      // check uniqueness
      isUnique = true;
      this.props.rowData.forEach(oldItem => {
        if (oldItem.symbol === symbol) {
          isUnique = false;
        }
      })

    }
    return symbol;
  }


  render() {
    return (
      <Fragment>
        <div className="button-wrap">
          <button onClick={this.onUpdate1Row}>Update 1 Row</button>
          <button onClick={this.onDelete1Row}>Delete 1 Row</button>
          <button onClick={this.onAdd1Row}>Add 1 Row</button>
          <br />
          <button onClick={this.onUpdate100Rows}>Update 100 Rows</button>
          <button onClick={this.onDelete100Rows}>Delete 100 Rows</button>
          <button onClick={this.onAdd100Rows}>Add 100 Rows</button>
        </div>
        <div
          className="ag-theme-balham"
          style={{
            height: '90vh',
            // width: '100%'
          }}>
          <AgGridReact
            columnDefs={this.props.columnDefs}
            rowData={this.props.rowData}
            defaultColDef={{ width: 150 }}
            onGridReady={this.onGridReady}
            deltaRowMode={true}
            getRowNodeId={data => data.symbol}>
          </AgGridReact>
        </div>

      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    columnDefs: state.columnDefs,
    rowData: state.rowData
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdate1Row: row => dispatch(actions.update1Row(row)),
    onDelete1Row: row => dispatch(actions.delete1Row(row)),
    onAdd1Row: row => dispatch(actions.add1Row(row)),
    onUpdate100Rows: rows => dispatch(actions.update100Rows(rows)),
    onDelete100Rows: rows => dispatch(actions.delete100Rows(rows)),
    onAdd100Rows: rows => dispatch(actions.add100Rows(rows)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);