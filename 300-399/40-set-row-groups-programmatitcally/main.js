var gridOptions = {
  columnDefs: [
    { field: 'athlete', minWidth: 150 },
    { field: 'age', maxWidth: 90 },
    { field: 'country', rowGroup: true, minWidth: 150 },
    { field: 'year', rowGroup: true, maxWidth: 90 },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ],
  defaultColDef: {
    enableRowGroup: true,
    flex: 1,
    minWidth: 100,
  },
  enableRangeSelection: true,
  rowGroupPanelShow: 'always'
};

function group(fieldA, fieldB) {
  let colA = gridOptions.columnApi.getColumn(fieldA);
  let colB = gridOptions.columnApi.getColumn(fieldB);
  gridOptions.columnApi.setRowGroupColumns([colA, colB]);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json',
    })
    .then(function(data) {
      gridOptions.api.setRowData(data);
    });
});
