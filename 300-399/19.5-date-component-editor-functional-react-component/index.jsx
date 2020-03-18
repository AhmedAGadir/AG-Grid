'use strict';

import React, {
  Component,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const datePicker = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.value = props.value;
    $(inputRef.current).datepicker({ dateFormat: 'dd/mm/yy' });
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        afterGuiAttached() {
          setTimeout(() => {
            inputRef.current.focus();
            inputRef.current.select();
          }, 500);
        },
        getValue() {
          return inputRef.current.value;
        },
      };
    },
    [inputRef]
  );

  return (
    <input
      ref={inputRef}
      className="ag-input-field-input ag-text-field-input"
      style={{ height: '100%' }}
      type="text"
    />
  );
});

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { field: 'athlete', editable: true },
        {
          field: 'date',
          editable: true,
          cellEditorFramework: datePicker,
        },
        {
          field: 'age',
          maxWidth: 110,
        },
        { field: 'country' },
        {
          field: 'year',
          maxWidth: 120,
        },
        { field: 'sport' },
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
        { field: 'total' },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 150,
      },
      rowData: [],
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
    };

    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          id="myGrid"
          style={{
            height: '100%',
            width: '100%',
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            onGridReady={this.onGridReady}
            rowData={this.state.rowData}
          />
        </div>
      </div>
    );
  }
}

render(<GridExample></GridExample>, document.querySelector('#root'));
