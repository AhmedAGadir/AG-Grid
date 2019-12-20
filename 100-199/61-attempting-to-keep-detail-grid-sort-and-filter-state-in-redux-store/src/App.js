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

  componentWillMount() {
    console.log('[componentWillMount]App')
  }

  componentWillReceiveProps(nextProps) {
    console.log('[componentWillReceiveProps]App', nextProps)
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.rowData) {
      return true;
    }

    const hasSortingChanged = this.props.rowData.some((prevRow, ind) => {
      return this.hasTabSortingChanged('gridTab1', prevRow, nextProps, ind) || this.hasTabSortingChanged('gridTab2', prevRow, nextProps, ind);
    });

    const hasFilterChanged = this.props.rowData.some((prevRow, ind) => {
      return this.hasTabFilterChanged('gridTab1', prevRow, nextProps, ind) || this.hasTabFilterChanged('gridTab2', prevRow, nextProps, ind);
    })

    if (hasSortingChanged || hasFilterChanged) {
      // return false;
    }
    return true
  }

  hasTabSortingChanged(tab, prevRow, nextProps, ind) {
    const prevSortModel = prevRow.detail[tab].sortModel;
    const nextSortModel = nextProps.rowData[ind].detail[tab].sortModel;

    if (prevSortModel.length === 0 && nextSortModel.length === 0) {
      return false
    } else {
      return prevSortModel.length !== nextSortModel.length ||
        prevSortModel[0].colId !== nextSortModel[0].colId ||
        prevSortModel[0].sort !== nextSortModel[0].sort
    }
  }

  hasTabFilterChanged(tab, prevRow, nextProps, ind) {
    const prevFilterModel = prevRow.detail[tab].filterModel;
    const nextFilterModel = nextProps.rowData[ind].detail[tab].filterModel;

    const prevFilterModelKeys = Object.keys(prevFilterModel);
    const nextFilterModelKeys = Object.keys(nextFilterModel);

    if (prevFilterModelKeys.length === 0 && nextFilterModelKeys.length === 0) {
      return false
    } else if (prevFilterModelKeys.length !== nextFilterModelKeys.length !== 0) {
      return true
    } else {
      return prevFilterModelKeys.some(key => !nextFilterModel.hasOwnProperty(key) ||
        prevFilterModel[key].values.join(' ') !== nextFilterModel[key].values.join(' ')
      ) || nextFilterModelKeys.some(key => !prevFilterModel.hasOwnProperty(key) ||
        prevFilterModel[key].values.join(' ') !== nextFilterModel[key].values.join(' ')
      )
    }
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
          style={{ margin: '10px' }}
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
            // keepDetailRows
            detailCellRendererFramework={MyDetailCellRenderer}
            detailCellRendererParams={{
              suppressRefresh: true,
              rowData: this.props.rowData,
              setSortModel: this.props.onSetSortModel,
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
    onInitRowData: () => dispatch(actions.initRowData()),
    onSetSortModel: (rowIndex, tab, sortModel) => dispatch(actions.setSortModel(rowIndex, tab, sortModel)),
    onSetFilterModel: (rowIndex, tab, filterModel) => dispatch(actions.setFilterModel(rowIndex, tab, filterModel))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);