import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const App = () => {
  const [variable, setVariable] = useState("FOO");
  const variableRef = useRef(variable);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  useEffect(() => {
    variableRef.current = variable;
  });

  useEffect(() => {
    if (variable === "FOO") {
      return;
    }
    console.log("variable is now ", variableRef.current);
    console.log("refreshing grid");

    gridApi.refreshCells({ force: true });
  }, [variable]);

  const [rowData, setRowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }
  ]);

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

  return (
    <div>
      <button onClick={() => setVariable("BAR")}>set variable to BAR</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          onGridReady={onGridReady}
          rowData={rowData}
          groupDefaultExpanded={-1}
          components
          autoGroupColumnDef={{
            minWidth: 300,
            cellRendererParams: {
              innerRenderer: params => {
                return `${params.value} (variable="${variableRef.current}")`;
              },
              suppressCount: true
            }
          }}
        >
          <AgGridColumn field="make" rowGroup />
          <AgGridColumn field="model" />
          <AgGridColumn field="price" />
        </AgGridReact>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
