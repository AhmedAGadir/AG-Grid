import React, { Component, Fragment } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';
import uuidv4 from 'uuid';;

class App extends Component {

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json')
      .then(res => res.json())
      .then(data => {
        var idSequence = 0;
        data.forEach(d => d.id = idSequence++);
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

  onCellValueChanged(params) {
    console.log('onCellValueChanged')
    debugger;
  }

  render() {
    return (
      <Fragment>
        <button onClick={this.props.onUpdateRandRow} style={{ margin: 10 + 'px' }}>Update Random Row</button>
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
            defaultColDef={{ width: 150, editable: true }}
            onGridReady={this.onGridReady.bind(this)}
            deltaRowMode={true}
            getRowNodeId={data => data.id}
            onCellValueChanged={this.onCellValueChanged.bind(this)}
            onRowDataUpdated={params => {
              console.log('onRowDataUpdated')
              debugger;
            }}>
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
    onUpdateRandRow: () => dispatch(actions.updateRandRow())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);