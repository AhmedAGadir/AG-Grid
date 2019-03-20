import React, { Component, Fragment } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';

import { rows, tabDetails } from './gridData';
import uuidv4 from 'uuid';
import MyGroupCellRenderer from './components/MyGroupCellRenderer';
import MyDetailCellRenderer from './components/MyDetailCellRenderer/MyDetailCellRenderer';

class App extends Component {

  componentDidMount() {
    var rowData = rows.map(row => ({
      ...row,
      id: uuidv4(),
      detailData: tabDetails[row.mainCol1]
    }));

    debugger;
    this.props.onInitRowData(rowData);
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
          style={{ margin: '10px', fontSize: '12px' }}
          onClick={() => console.log(this.props.rowData)}>Log All Row Data</button>
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
              { headerName: 'Main Col1', field: 'mainCol1' },
              { headerName: 'Main Col2', field: 'mainCol2' },
            ]}
            masterDetail={true}
            detailCellRendererFramework={MyDetailCellRenderer}
            detailCellRendererParams={{
              getSortModel: this.props.onGetSortModel,
              setSortModel: this.props.onSetSortModel,
              getFilterModel: this.props.onGetFilterModel,
              setFilterModel: this.props.onSetFilterModel
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
    onInitRowData: rowData => dispatch(actions.initRowData(rowData)),
    onGetSortModel: (tab, rowIndex) => dispatch(actions.getSortModel(tab, rowIndex)),
    onGetFilterModel: (tab, rowIndex) => dispatch(actions.getFilterModel(tab, rowIndex)),
    onSetSortModel: (tab, sortModel) => dispatch(actions.setSortModel(tab, sortModel)),
    onSetFilterModel: (tab, filterModel) => dispatch(actions.setFilterModel(tab, filterModel))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);