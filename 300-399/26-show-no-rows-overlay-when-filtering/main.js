var columnDefs = [
  { field: 'athlete', width: 150 },
  { field: 'age', width: 90 },
  { field: 'country', width: 120 },
  { field: 'year', width: 90 },
  { field: 'date', width: 110 },
  { field: 'sport', width: 110 },
  { field: 'gold', width: 100 },
  { field: 'silver', width: 100 },
  { field: 'bronze', width: 100 },
  { field: 'total', width: 100 },
];

var gridOptions = {
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    resizable: true,
    filter: true,
  },
  // set rowData to null or undefined to show loading panel by default
  rowData: null,
  columnDefs: columnDefs,
  onFilterChanged: onFilterChanged,
  components: {
    customNoRowsOverlay: CustomNoRowsOverlay,
  },
  noRowsOverlayComponent: 'customNoRowsOverlay',
  noRowsOverlayComponentParams: {
    noRowsMessageFunc: noRowsMessageFunc,
  },
};

function getFilteredRowsCount() {
  let count = 0;
  gridOptions.api.forEachNodeAfterFilter(row => count++);
  return count;
}

function onFilterChanged(params) {
  let filteredRowsCount = getFilteredRowsCount();
  if (filteredRowsCount === 0) {
    params.api.showNoRowsOverlay();
  } else {
    params.api.hideOverlay();
  }
}

function noRowsMessageFunc() {
  let filteredRowsCount = getFilteredRowsCount();
  if (filteredRowsCount === 0) {
    return 'No results matching the search';
  }
  return 'Sorry - no rows! at: ' + new Date();
}

function onBtShowNoRows() {
  gridOptions.api.showNoRowsOverlay();
}

function onBtHide() {
  gridOptions.api.hideOverlay();
}

document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  var httpRequest = new XMLHttpRequest();
  httpRequest.open(
    'GET',
    'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
  );
  httpRequest.send();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      var httpResult = JSON.parse(httpRequest.responseText);
      gridOptions.api.setRowData(httpResult);
    }
  };
});
