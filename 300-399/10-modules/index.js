import '@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham.css';

// *** works ***
// import {Grid} from '@ag-grid-enterprise/all-modules';
// *** works ***
// import {Grid} from '@ag-grid-community/core';
// *** doesn't work ***
import {Grid} from '@ag-grid-enterprise/core';

import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {ColumnsToolPanelModule} from '@ag-grid-enterprise/column-tool-panel';

// *** Alternative ***
// import {Grid, ClientSideRowModelModule, ColumnsToolPanelModule} from '@ag-grid-enterprise/all-modules';



var columnDefs = [
  {headerName: "Make", field: "make"},
  {headerName: "Model", field: "model"},
  {headerName: "Price", field: "price"}
];
    
// specify the data
var rowData = [
  {make: "Toyota", model: "Celica", price: 35000},
  {make: "Ford", model: "Mondeo", price: 32000},
  {make: "Porsche", model: "Boxter", price: 72000}
];
    
// let the grid know which columns and what data to use
var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  sideBar: true
  
};

var eGridDiv = document.querySelector('#myGrid');

new Grid(eGridDiv, gridOptions, {modules: [ClientSideRowModelModule, ColumnsToolPanelModule]});
