var columnDefs = [
  { field: 'athlete' },
  { field: 'country', rowGroup: true, rowGroupIndex: 2 },
  { field: 'year', comparator: customComparator, rowGroup: true, rowGroupIndex: 1 },
  { field: 'gold' },
];

function customComparator(val1, val2, nodeA, nodeB, isInverted) {
  if (!nodeA.group || !nodeB.group || nodeA.field === 'country' || nodeB.field === 'country') {
    return 0;
  }
  var order = {
    2012: 1,
    2006: 2,
    2008: 3,
    2010: 4,
    2004: 5,
    2000: 6,
  }

  // works for simple column 'Year' but not the autoGroupColumnDef 'Year'
  return order[val1] - order[val2];
}

var gridOptions = {
  columnDefs: columnDefs,
  autoGroupColumnDef: {
    comparator: customComparator
  },
  defaultColDef: {
    sortable: true,
    enableRowGroup: true,
    enableValue: true,
  },
  sideBar: true,
  groupDefaultExpanded: -1
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
      gridOptions.api.setRowData(data.slice(0, 20));
    });
});
