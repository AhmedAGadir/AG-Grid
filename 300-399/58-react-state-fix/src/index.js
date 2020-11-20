import React, { useState, useRef, useEffect } from "react";
import { render } from "react-dom";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const StatusRenderer = cellProps => {
  console.log('statusRenderer: created', cellProps.data);
  const onChange = e => {
    console.log('statusRenderer: onChange')
    cellProps.onChangeStatus(cellProps.rowIndex, e.target.checked);
  };

  return (
    <input type="checkbox" checked={cellProps.value} onChange={onChange} />
  );
};

const App = () => {
  const [gridApi, setGridApi] = useState(null);
  const [columnDefs, setColumnDefs] = useState(null);
  

  const [rowData, setRowData] = useState([]);
  console.log('binding rowData', rowData);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    setRowData([{ key: "1", status: true }]);
    console.log('setting column defs', rowData);

    setColumnDefs([
      { headerName: "key", field: "key" },
      {
        headerName: "status",
        field: "status",
        cellRenderer: 'statusRenderer',
        cellRendererParams: {
          onChangeStatus: onChangeStatus
        }
      }
    ]);
    return () => {
      isMounted.current = false;
    };
  }, []);



  const onChangeStatus = (idx, v) => {
    setRowData(lastRowData => {
      const newData = JSON.parse(JSON.stringify(lastRowData));
      newData[idx].status = v;
      return newData;
    })
  };

  return (
    <>
      {JSON.stringify(rowData)}
      <div
        style={{ width: "100vw", height: "100vh" }}
        className="ag-theme-alpine "
      >
        <AgGridReact
          enableRangeSelection
          allowShowChangeAfterFilter
          groupSelectsFiltered
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true
          }}
          onGridSizeChanged={params => {
            params.api.sizeColumnsToFit();
          }}
          onGridColumnsChanged={params => {
            params.api.sizeColumnsToFit();
          }}
          onGridReady={param => {
            if (isMounted.current) {
              setGridApi(param.api);
              param.api.sizeColumnsToFit();
            }
          }}
          frameworkComponents={{
            statusRenderer: StatusRenderer
          }}
        />
      </div>
    </>
  );
};

render(<App />, document.getElementById("root"));
