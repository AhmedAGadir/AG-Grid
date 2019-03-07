import React, { Component, Fragment } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';
import uuidv4 from 'uuid';

class App extends Component {

  componentDidMount() {
    fetch('https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json')
      .then(res => res.json())
      .then(data => {
        data = data.slice(0, 20).map(d => ({
          ...d,
          id: uuidv4(),
          updates: 0
        }))
        this.props.onInitRowData(data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // should be able to add this directly to the AGGridReact component but cant (is this a bug?)
    this.gridApi.addEventListener('reduxRowsUpdated', this.onReduxRowUpdated.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.rowData) {
      return;
    }

    const updatedNodes = this.props.rowData
      .filter((row, ind) => prevProps.rowData[ind].updates !== row.updates)
      .map(row => this.gridApi.getRowNode(row.id));

    this.gridApi.eventService.dispatchEvent({ type: 'reduxRowsUpdated', updatedNodes: updatedNodes });
  }

  onReduxRowUpdated(params) {
    console.log('rows updated via redux:', params.updatedNodes);
  }


  render() {
    return (
      <Fragment>
        <button onClick={() => this.props.onUpdateRows(0, 5)}>Update Rows 0-5</button>
        <button onClick={() => this.props.onUpdateRows(5, 10)}>Update Rows 5-10</button>
        <button onClick={() => this.props.onUpdateRows(10, 15)}>Update Rows 10-15</button>
        <button onClick={() => this.props.onUpdateRows(15, 20)}>Update Rows 15-20</button>
        <p>(Open console to view results)</p>
        <div
          className="ag-theme-balham"
          style={{
            height: '90vh',
            // width: '100%'
          }}>
          <AgGridReact
            columnDefs={[
              { headerName: 'Athlete', field: 'athlete' },
              { headerName: 'Age', field: 'age' },
              { headerName: 'Number Of Times Updated', field: 'updates', width: 200 }
            ]}
            rowData={this.props.rowData}
            defaultColDef={{ width: 150, editable: true }}
            onGridReady={this.onGridReady.bind(this)}
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
    rowData: state.rowData,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onInitRowData: rowData => dispatch(actions.initRowData(rowData)),
    onUpdateRows: (min, max) => dispatch(actions.updateRows(min, max))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);