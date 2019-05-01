import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import './App.css';

import { Slider } from 'antd';
import 'antd/dist/antd.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          field: 'name'
        },
        {
          field: 'sliderValue',
          cellRendererFramework: (params) => (
            <Slider
              max={100}
              min={0}
              defaultValue={Number(params.data.sliderValue)}
              onAfterChange={(value) => this.onSliderValueChanged(value, params)} />
          )
        }
      ],
      // make sure to use deltaRowDataMode when syncing state with rowData
      rowData: [
        {
          id: "1",
          name: "John",
          sliderValue: 100
        },
        {
          id: "2",
          name: "Bob",
          sliderValue: 50
        }
      ]
    };
  }

  onSliderValueChanged(newValue, params) {
    let nodeIndex = this.state.rowData.findIndex(row => row.id === params.node.id);
    if (newValue === this.state.rowData[nodeIndex].sliderValue) {
      return;
    }
    console.log('[onSliderValueChanged]', 'value', params.value, 'newValue', newValue);
    this.setState(prevState => ({
      rowData: prevState.rowData.map(row => ({
        ...row,
        sliderValue: row.id === params.node.id ? newValue : row.sliderValue
      }))
    }));
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  render() {
    return (
      <div style={{ width: "100%", height: "100vh" }}>
        <div
          id="myGrid"
          style={{
            height: "100%",
            width: "100%"
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            deltaRowDataMode={true}
            getRowNodeId={data => data.id}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    )
  }
}

export default App;

