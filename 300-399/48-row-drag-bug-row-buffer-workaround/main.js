const DATA_LENGTH = 200

var gridOptions = {
  columnDefs: [
    {
      field: 'athlete',
      rowDrag: function(params) {
        // only rows that are NOT groups should be draggable
        return !params.node.group;
      },
    },
    { field: 'country', rowGroup: true },
    { field: 'year', width: 100 },
    { field: 'date' },
    { field: 'sport' },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
  ],
  defaultColDef: {
    width: 170,
    sortable: true,
    filter: true,
  },
  animateRows: true,
  groupDefaultExpanded: 1,
  onRowDragMove: onRowDragMove,
  getRowNodeId: data => data.id,
  // UNCOMMENT **** works when row buffer is large enough
  // rowBuffer: DATA_LENGTH,
};

function onRowDragMove(event) {
  var movingNode = event.node;
  var overNode = event.overNode;

  // find out what country group we are hovering over
  var groupCountry;
  if (overNode.group) {
    // if over a group, we take the group key (which will be the
    // country as we are grouping by country)
    groupCountry = overNode.key;
  } else {
    // if over a non-group, we take the country directly
    groupCountry = overNode.data.country;
  }

  var needToChangeParent = movingNode.country !== groupCountry;

  if (needToChangeParent) {
    var movingData = movingNode.data;
    movingData.country = groupCountry;
    gridOptions.api.applyTransaction({
      update: [movingData],
    });
    gridOptions.api.clearFocusedCell();
  }
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
      let idSeq = 0;
      data = data.reverse().slice(0, DATA_LENGTH);
      data.forEach(row => row.id = idSeq++)
      gridOptions.api.setRowData(data);
    });
});
