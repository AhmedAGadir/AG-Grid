import React, { Component } from 'react';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';

import { connect } from 'react-redux';
import * as actions from './store/actions';
import uuidv4 from 'uuid';

class App extends Component {

  componentDidMount() { }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      var idSequence = 0;
      data.forEach(function (item) {
        item.id = idSequence++;
      });
      var server = new FakeServer(data);
      var datasource = new ServerSideDatasource(server);
      params.api.setServerSideDatasource(datasource);
    };

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  }

  render() {
    return (
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
          onGridReady={this.onGridReady.bind(this)}
          deltaRowDataMode={true}
          getRowNodeId={data => data.id}
          rowModelType="serverSide"
          cacheBlockSize={100}
          maxBlocksInCache={10}
        >
        </AgGridReact>
      </div>
    );
  }
}

function ServerSideDatasource(server) {
  return {
    getRows(params) {
      setTimeout(function () {
        var response = server.getResponse(params.request);
        if (response.success) {
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 500);
    }
  };
}
function FakeServer(allData) {
  return {
    getResponse(request) {
      console.log("asking for rows: " + request.startRow + " to " + request.endRow);
      var rowsThisPage = allData.slice(request.startRow, request.endRow);
      var lastRow = allData.length <= request.endRow ? data.length : -1;
      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow
      };
    }
  };
}

const mapDispatchToProps = dispatch => {
  return {
    // onInitRowData: rowData => dispatch(actions.initRowData(rowData)),
  }
}

export default connect(null, mapDispatchToProps)(App);