"use strict";

import React, {
  Component
}
  from "react";
import {
  render
}
  from "react-dom";
import {
  AgGridReact
}
  from "ag-grid-react";

import axios from 'https://unpkg.com/axios@0.18.0/dist/axios.min.js';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [{
        headerName: "ID",
        width: 50,
        valueGetter: "node.id",
        // cellRenderer: "loadingRenderer"
      }, {
        headerName: "Id",
        field: "id",
        width: 50
      }, {
        headerName: "First Name",
        field: "first_name",
        width: 90
      }, {
        headerName: "Last Name",
        field: "last_name",
        width: 90
      }],
      defaultColDef: {
        resizable: true
      },
      // components: {
      // loadingRenderer: function (params) {
      //   if (params.value !== undefined) {
      //     return params.value;
      //   } else {
      //     return '<img src="../images/loading.gif">';
      //   }
      // }
      // },
      // rowBuffer: 0,
      // cacheOverflowSize: 1,
      // maxConcurrentDatasourceRequests: 1,
      // infiniteInitialRowCount: 1000,
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    var dataSource = {
      apiService: async (startRow, endRow) => {
        const size = endRow - startRow;
        const page = Math.round(startRow / size);
        const url = 'https://reqres.in/api/users?page=' + page;
        const response = await axios.get(url, {
          validateStatus: function (status) {
            return true;
          }
        });
        return {
          status: response.status,
          content: response.data,
          totalElements: response.data.total
        };
      },
      getRows: function (params) {
        setTimeout(async () => {
          var response = await this.apiService(params.startRow, params.endRow);
          if (response.status == 200) {
            console.log('response', response.content.data, response.totalElements);
            params.successCallback(response.content.data, response.totalElements);
          } else {
            params.failCallback();
          }
        }, 0);
      }
    };
    params.api.setDatasource(dataSource);
  };
  handleInsert = () => {
    this.gridApi.updateRowData({
      add: [this.getEmptyData],
      addIndex: 0
    }); //this.gridApi.getDisplayedRowCount() });
  }
  getEmptyData() {
    let newFormData = {};
    this.state.columnDefs.forEach(item => {
      if (item.headerName !== 'Actions') {
        newFormData[item.field] = null;
      }
    });
    return newFormData;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  render() {
    return (
      < div style={{
        width: "100%",
        height: "80vh"
      }} >
        < div id="myGrid" style={{
          height: "100%",
          width: "100%"
        }}
          className="ag-theme-balham" >
          <button onClick={this.handleInsert.bind(this)} className="btn btn-danger" >
            Insert Row
      </button>
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            rowSelection='multiple'
            // components={this.state.components}
            // pagination={true}
            rowModelType='infinite'
            // paginationPageSize={3}
            // cacheBlockSize={3}
            // maxBlocksInCache={1}
            onFirstDataRendered={this.onFirstDataRendered.bind(this)}
            onGridReady={this.onGridReady} />
        </div >
      </div>
    );
  }
}

render(< GridExample />, document.querySelector("#root"));