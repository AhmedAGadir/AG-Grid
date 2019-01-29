var columnDefs = [{
  headerName: '(Invalid If length !== 6)',
  field: 'a',
  width: 100,
  cellEditor: ValidationCellEditor
}, {
  field: 'b',
  width: 60
}, {
  field: 'c',
  width: 60
}];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createRowData(numRows) {
  let rowData = [];
  for (let i = 0; i < numRows; i++) {
    rowData.push({
      a: randomIntFromInterval(100000, 999999),
      b: randomIntFromInterval(0, 100),
      c: randomIntFromInterval(0, 100)
    });
  }
  return rowData;
}

var gridOptions = {
  columnDefs: columnDefs,
  rowData: createRowData(10),
  enableColResize: true,
  defaultColDef: {
    editable: true
  },
  onGridReady: function (params) {
    params.api.sizeColumnsToFit();

  }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});