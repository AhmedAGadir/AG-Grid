'use strict';

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState(null);

  const [groupLeaf, setGroupLeaf] = useState('athlete');

  const autoGroupColumnDef = {
    headerName: 'Grouped',
    valueGetter: (params) => params.data[groupLeaf],
    minWidth: 200,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      padding: 20,
      suppressCount: true,
    },
  };

  useEffect(() => {
    if (!gridApi) {
      return;
    }
    gridApi.setAutoGroupColumnDef(autoGroupColumnDef);
  }, [groupLeaf]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const httpRequest = new XMLHttpRequest();
    const updateData = (data) => {
      setRowData(data);
    };

    httpRequest.open(
      'GET',
      'https://www.ag-grid.com/example-assets/olympic-winners.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText).slice(0, 20));
      }
    };
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <button
        onClick={() =>
          setGroupLeaf((groupLeaf) =>
            groupLeaf === 'athlete' ? 'country' : 'athlete'
          )
        }
      >
        update autoGroup field
      </button>
      <div
        id="myGrid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            minWidth: 100,
          }}
          autoGroupColumnDef={autoGroupColumnDef}
          enableRangeSelection={true}
          onGridReady={onGridReady}
          rowData={rowData}
          groupDefaultExpanded={-1}
        >
          <AgGridColumn field="age" maxWidth={90} />
          <AgGridColumn field="country" rowGroup minWidth={150} />
          <AgGridColumn field="year" maxWidth={90} />
          <AgGridColumn field="date" minWidth={150} />
          <AgGridColumn field="sport" minWidth={150} />
          <AgGridColumn field="gold" />
          <AgGridColumn field="silver" />
          <AgGridColumn field="bronze" />
          <AgGridColumn field="total" />
        </AgGridReact>
      </div>
    </div>
  );
};

render(<GridExample></GridExample>, document.querySelector('#root'));
