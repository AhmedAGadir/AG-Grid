import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid/dist/styles/ag-grid.css";
import "ag-grid/dist/styles/ag-theme-balham.css";

import "./styles.css";

const GridExample = () => {
  const [updateCounter, setUpdateCounter] = useState(0);

  const updateName = params => {
    // console.log(updateCounter);
    // setUpdateCounter(prevCounter => prevCounter + 1);

    setUpdateCounter(prevCounter => {
      console.log(prevCounter);
      return prevCounter + 1;
    });
  };

  const columnDefs = [
    {
      headerName: "Athlete",
      field: "athlete",
      editable: true,
      onCellValueChanged: updateName
    }
  ];

  const fetchData = cb => {
    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      cb(data);
    };

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/olympicWinnersSmall.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  };

  const onGridReady = params => {
    params.api.setDatasource({
      getRows(params) {
        fetchData(data => params.successCallback(data));
      }
    });
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="grid-wrapper">
        <div
          id="myGrid"
          style={{
            boxSizing: "border-box",
            height: "100%",
            width: "100%"
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            rowModelType="infinite"
            columnDefs={columnDefs}
            onGridReady={onGridReady}
          />
        </div>
      </div>
      <button onClick={() => setUpdateCounter(updateCounter + 1)}>
        Increment counter
      </button>

      <h1>Counter = {updateCounter}</h1>
    </div>
  );
};

const App = () => {
  return (
    <div
      className="ag-theme-balham"
      style={{
        height: "500px",
        width: "600px"
      }}
    >
      <GridExample />
    </div>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
