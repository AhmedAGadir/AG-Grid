'use strict';

import React, { useState, useEffect, useRef, useContext } from 'react';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from '@ag-grid-community/react';
import TableContext from './TableContext.js';

import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine-dark.css';

const GridExample = () => {
  // const [dummy, setDummy] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const gridApiRef = useRef(null);

    const [headerNameHookFromContext, setHeaderNameHookFromContext] = useContext(
    TableContext
  );

  function headerValueGetter(params) {
    // for a separate issue
    // setDummy(val => ....)
    console.log('headerValueGetter', headerNameHookFromContext);
    return headerNameHookFromContext;
  }

  function hashValueGetter(params) {
    console.log('hashValueGetter', headerNameHookFromContext);
    return headerNameHookFromContext;
  };


  const onGridReady = (params) => {
    setGridApi(params.api);
    gridApiRef.current = params.api;
    setGridColumnApi(params.columnApi);

    console.log('headerNameHookFromContext', headerNameHookFromContext);
  };

  // comment this useEffect and uncomment bottom one to make it work
  useEffect(() => {
    console.log('headerNameHookFromContext changed', headerNameHookFromContext)
    if (gridApiRef.current) {
      gridApiRef.current.refreshHeader();
      gridApiRef.current.refreshCells({force: true});
      gridApiRef.current.redrawRows();
    }
  }, [headerNameHookFromContext]);
  // ---------------------------------------------------------

  // uncomment and comment above one to make it work------------------
  //   useEffect(() => {
  //     if (gridApiRef.current) {
  //       setTimeout(() => { // extra timeout to be sure context is updated
  //         gridApiRef.current.refreshHeader();
  //         gridApiRef.current.refreshCells();
  //       }, 0)
  //     }
  // }, [headerNameHook])
  //--------------------------------------------
  // console.log('render', tableContext)

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        id="myGrid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ag-theme-alpine-dark"
      >
        <button
          onClick={() => {
            setHeaderNameHookFromContext('bar');
          }}
        >
          Click tu update context
        </button>
        <AgGridReact
          modules={AllCommunityModules}
          defaultColDef={{
            flex: 1,
            minWidth: 75,
          }}
          rowData={createRowData()}
          onGridReady={onGridReady}
        >
          <AgGridColumn
            headerName="#"
            maxWidth={100}
            valueGetter={hashValueGetter}
            headerValueGetter={headerValueGetter}
          />
          <AgGridColumn field="a" />
          <AgGridColumn field="b" />
          <AgGridColumn
            headerName="A + B"
            colId="a&b"
            valueGetter={abValueGetter}
          />
          <AgGridColumn
            headerName="A * 1000"
            minWidth={95}
            valueGetter={a1000ValueGetter}
          />
          <AgGridColumn
            headerName="B * 137"
            minWidth={90}
            valueGetter={b137ValueGetter}
          />
          <AgGridColumn
            headerName="Random"
            minWidth={90}
            valueGetter={randomValueGetter}
          />
          <AgGridColumn headerName="Chain" valueGetter={chainValueGetter} />
          <AgGridColumn
            headerName="Const"
            minWidth={85}
            valueGetter={constValueGetter}
          />
        </AgGridReact>
      </div>
    </div>
  );
};

function abValueGetter(params) {
  return params.data.a + params.data.b;
}
var a1000ValueGetter = function (params) {
  return params.data.a * 1000;
};
var b137ValueGetter = function (params) {
  return params.data.b * 137;
};
var randomValueGetter = function () {
  return Math.floor(Math.random() * 1000);
};
var chainValueGetter = function (params) {
  return params.getValue('a&b') * 1000;
};
var constValueGetter = function () {
  return 99999;
};
function createRowData() {
  var rowData = [];
  for (var i = 0; i < 1; i++) {
    rowData.push({
      a: Math.floor(i % 4),
      b: Math.floor(i % 7),
    });
  }
  return rowData;
}

const App = () => {
  const [headerNameHook, setHeaderNameHook] = useState('foo');

  return (
    <TableContext.Provider value={[headerNameHook, setHeaderNameHook]}>
      <GridExample />
    </TableContext.Provider>
  );
};

render(<App></App>, document.querySelector('#root'));
