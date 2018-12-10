// specify the columns
var columnDefs = [
  { headerName: "Letter", field: "letter", rowGroup: true, hide: true },
  { headerName: "x", field: "x" },
  { headerName: "y", field: "y" },
  {
    headerName: "X/Y",
    field: "x/y",
    valueGetter: params => {
      if (params.node.group) return;
      return params.data.x / params.data.y
    }
  }
];

// specify the data
var rowData = [
  { letter: "a", x: 223, y: 50 },
  { letter: "b", x: 323, y: 30 },
  { letter: "c", x: 323, y: 30 },
  { letter: "d", x: 323, y: 30 },
  { letter: "a", x: 323, y: 30 },
  { letter: "b", x: 323, y: 30 },
  { letter: "c", x: 323, y: 30 },
  { letter: "d", x: 323, y: 30 },
  { letter: "a", x: 323, y: 30 },
  { letter: "b", x: 323, y: 30 },
  { letter: "c", x: 323, y: 30 },
  { letter: "d", x: 323, y: 30 }
];

// let the grid know which columns and what data to use
var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  onGridReady: () => {
    gridOptions.api.sizeColumnsToFit();
  }
};

// lookup the container we want the Grid to use
var eGridDiv = document.querySelector("#myGrid");

// create the grid passing in the div to use together with the columns & data we want to use
new agGrid.Grid(eGridDiv, gridOptions);
