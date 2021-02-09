const rowData = [
  { phase: 'phase1', ABC1: 450, ABC2: 200, ABC3: 300},
  { phase: 'phase2', ABC1: 1500, ABC2: 267, ABC3: 718},
  { phase: 'phase3', ABC1: 2390, ABC2: 1234, ABC3: 8745},
  { phase: 'phase4', ABC1: 2500, ABC2: 216, ABC3: 10020},
];

const columnDefs = [
  { field: 'phase' },
  { field: 'ABC1', aggFunc: 'sum' },
  { field: 'ABC2', aggFunc: 'sum' },
  { field: 'ABC3', aggFunc: 'sum' },
];

var gridOptions = {
  rowData: rowData,
  columnDefs: columnDefs,
  defaultColDef: {
    editable: true,
    sortable: true,
    flex: 1,
    minWidth: 100,
    filter: true,
    resizable: true,
  },
  popupParent: document.body,
  enableRangeSelection: true,
  enableCharts: true,
  sideBar: true,
  // pivotMode: true,
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
  let chartParams = {
    cellRange: {
      rowStartIndex: 0,
      rowEndIndex: 4,
      columns: ['phase', 'ABC1', 'ABC2', 'ABC3'],
    },
    chartType: 'groupedColumn',
    chartContainer: document.querySelector('#myChart'),
  };

  params.api.createRangeChart(chartParams);
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});
