import React from "react";
import ReactDOM from "react-dom";

import "./styles.scss";
import Grid from "./grid";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

function App() {
  return (
    <div className="App">
      <Grid />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
