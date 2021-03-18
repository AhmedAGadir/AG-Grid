import { render } from "react-dom";
import React, { useState, useEffect, useRef } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const COUNTRIES = {
  UK: "uk",
  US: "usa",
  AU: "aus"
};

const Grid = () => {
  const [gridApi, setGridApi] = useState(null);
  const [country, setCountry] = useState(COUNTRIES.UK);
  const countryRef = useRef(country);
  const [isFirstload, setIsFirstLoad] = useState(true);

  useEffect(() => {
    countryRef.current = country;
  });

  useEffect(() => {
    if (isFirstload) {
      setIsFirstLoad(false);
    } else {
      gridApi.redrawRows();
    }
  }, [country]);

  const rowData = [
    {
      make: { usa: "Opel", uk: "Vauxhall", aus: "Holden" },
      model: "Corsa",
      price: 15000
    },
    {
      make: { usa: "Opel", uk: "Vauxhall", aus: "Holden" },
      model: "Insignia",
      price: 25000
    },

    {
      make: { usa: "Opel", uk: "Vauxhall", aus: "Holden" },
      model: "Astra",
      price: 18000
    }
  ];

  const valueGetter = params => {
    const country = countryRef.current;
    return params.data.make[country];
  };

  const columnDefs = [
    { field: "make", valueGetter: valueGetter },
    { field: "model" },
    { field: "price" }
  ];

  const gridOptions = {};

  const onGridReady = params => {
    setGridApi(params.api);
  };

  return (
    <>
      <span>
        <button onClick={() => setCountry(COUNTRIES.US)}>U.S.A</button>
        <button onClick={() => setCountry(COUNTRIES.UK)}>U.K</button>
        <button onClick={() => setCountry(COUNTRIES.AU)}>Australia</button>
      </span>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
      </div>
    </>
  );
};

render(<Grid />, document.getElementById("root"));
