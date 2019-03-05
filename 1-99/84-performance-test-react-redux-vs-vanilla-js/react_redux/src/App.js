import React, { Component, Fragment } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';

// HOW TO GET REFERENCES TO 100 DIFFERENT (UNIQUE) ROWS 
// const alreadyAdded = new Set();
// while (alreadyAdded.size < 100) {
//   const randRow = this.props.rowData[Math.floor(Math.random() * this.props.rowData.length)];
//   if (alreadyAdded.has(randRow)) continue;
//   alreadyAdded.add(randRow)
// }

class App extends Component {

  componentDidMount() {
    // not using redux thunk / asynchronous action setters
    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json')
      .then(res => res.json())
      .then(data => {
        data.forEach(d => d.id = this.createUniqueRandomSymbol(data));
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

  update1RowHandler = () => {
    const randInd = this.getRandInd();
    this.props.onUpdateRows([randInd]);
  }

  delete1RowHandler = () => {
    const randInd = this.getRandInd();
    this.props.onDeleteRows([randInd]);
  }

  add1RowHandler = () => {
    const randInd = this.getRandInd();
    const symbol = this.createUniqueRandomSymbol();
    this.props.onAddRows([randInd], [symbol]);
  }

  update100RowsHandler = () => {
    const indexSet = new Set();
    while (indexSet.size < 100) {
      const randInd = this.getRandInd();
      if (indexSet.has(randInd)) {
        continue;
      }
      indexSet.add(randInd);
    }
    this.props.onUpdateRows([...indexSet]);
  }

  delete100RowsHandler = () => {
    const indexSet = new Set();
    while (indexSet.size < 100) {
      const randInd = this.getRandInd();
      if (indexSet.has(randInd)) {
        continue;
      }
      indexSet.add(randInd);
    }
    this.props.onDeleteRows([...indexSet]);
  }

  add100RowsHandler = () => {
    const indexSet = new Set();
    const symbolSet = new Set();
    while (indexSet.size < 100) {
      const randInd = this.getRandInd();
      const symbol = this.createUniqueRandomSymbol();
      if (indexSet.has(randInd) || symbolSet.has(symbol)) {
        continue;
      }
      indexSet.add(randInd);
      symbolSet.add(symbol);
    }
    this.props.onAddRows([...indexSet], [...symbolSet]);
  }

  getRandInd() {
    return Math.floor(Math.random() * this.props.rowData.length);
  }

  createUniqueRandomSymbol(data = this.props.rowData) {
    var symbol;
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var isUnique = false;
    while (!isUnique) {
      symbol = '';
      for (var i = 0; i < 10; i++) {
        symbol += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      isUnique = true;
      if (data.some(row => row.id === symbol)) {
        isUnique = false;
      }
    }
    return symbol;
  }


  render() {
    return (
      <Fragment>
        <div className="button-wrap">
          <button onClick={this.update1RowHandler}>Update 1 Row</button>
          <button onClick={this.delete1RowHandler}>Delete 1 Row</button>
          <button onClick={this.add1RowHandler}>Add 1 Row</button>
          <br />
          <button onClick={this.update100RowsHandler}>Update 100 Rows</button>
          <button onClick={this.delete100RowsHandler}>Delete 100 Rows</button>
          <button onClick={this.add100RowsHandler}>Add 100 Rows</button>
        </div>
        <div
          className="ag-theme-balham"
          style={{
            height: '90vh',
            // width: '100%'
          }}>
          <AgGridReact
            columnDefs={[
              { headerName: 'Athlete', field: 'athlete' },
              { headerName: 'Sport', field: 'sport' },
              { headerName: 'Age', field: 'age' },
              { headerName: 'Year', field: 'year' },
              { headerName: 'Date', field: 'date' },
              { headerName: 'Gold', field: 'gold' },
              { headerName: 'Silver', field: 'silver' },
              { headerName: 'Bronze', field: 'bronze' }
            ]}
            rowData={this.props.rowData}
            defaultColDef={{ width: 150 }}
            onGridReady={this.onGridReady}
            deltaRowDataMode={true}
            getRowNodeId={data => data.id}>
          </AgGridReact>
        </div>

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
    onInitRowData: rowData => dispatch(actions.initRowData(rowData)),
    onUpdateRows: indexArr => dispatch(actions.updateRows(indexArr)),
    onDeleteRows: indexArr => dispatch(actions.deleteRows(indexArr)),
    onAddRows: (indexArr, symbolArr) => dispatch(actions.addRows(indexArr, symbolArr)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);