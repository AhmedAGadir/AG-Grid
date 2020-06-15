var gridOptions = {
  columnDefs: [
    { field: 'athlete', minWidth: 150 },
    { field: 'age', maxWidth: 90 },
    { field: 'country', rowGroup: true, minWidth: 150 },
    { field: 'year', maxWidth: 90 },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    resizable: true,
    autoHeight: true
  },
  autoGroupColumnDef: {
    minWidth: 200,
    cellRendererParams: {
      innerRenderer: 'myGroupRenderer'
    }
  },
  components: {
    myGroupRenderer: MyGroupRenderer
  },
  groupDefaultExpanded: -1,
  enableRangeSelection: true,
  onColumnResized: params => {
    if (params.finished) {
      params.api.resetRowHeights();
    }
  }
};

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
      data = data.slice(0,20).map(d => ({
        ...d,
        country: (d.country + ' ').repeat(5)
      }))
      gridOptions.api.setRowData(data);
    });
});


function MyGroupRenderer() {}

MyGroupRenderer.prototype.init = function(params) {
  this.eGui = document.createElement('div');
  this.eGui.style.whiteSpace = 'normal';
  this.eGui.innerHTML = params.value;
}

MyGroupRenderer.prototype.getGui = function() {
  return this.eGui;
}