import React from 'react';
import { AgGrid } from 'ag-grid';
import { AgGridReact } from 'ag-grid-react';
import _ from 'lodash';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    /**
         * @type {object}
         * @property {Object} rowDatas - has the row information
         * @property {Array} columnDefs - has the details of columns in the SubGrid
         * @property {object} restoreDefault -to restore the default settings
         * @property {string} entityName - has the entity name
         * @property {Array} ids - has the id's
         */
    this.state = {
      columnDefs: [],
      rowDatas: [],
      restoreDefault: false,
      entityName: '',
      ids: []
    };
  }

  componentDidMount = () => {
    //In here we are sorting the whole data coming from the parent grid
    this.setState({ rowDatas: [{ test: 'componentDidMount', uniqueId: 'componentDidMount' }], showLoader: false });
  }

  getRowNodeId = (data) => {
    return data.uniqueId;
  }

  /**
   *Invoked when component recieves a new props.
   */
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps');
    this.setState({ rowDatas: nextProps.rows }, () => {
      //NO NEED TO DO THIS!
      this.gridApi.setRowData(this.state.rowDatas);
    });
  }


  render() {
    return (

      <AgGridReact
        // properties

        columnDefs={[{
          field: 'test'
        }]}
        rowData={this.state.rowDatas}
        showToolPanel={false}
        enableSorting
        enableColResize
        enableFilter
        onGridReady={this.onGridReady}
        onRowDoubleClicked={this.openEditObjectModal}
        groupUseEntireRow
        processRowPostCreate={this.processRowPostCreate}
        rememberGroupStateWhenNewData
        deltaRowDataMode
        getRowNodeId={this.getRowNodeId}
        onCellClicked={this.handleTabClicked}
      />

    );
  }
}