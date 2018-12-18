var columnDefs = [
  { field: 'id' },
  { field: 'athlete', width: 150 },
  { field: 'age' },
  { field: 'country' },
  { field: 'year' },
  { field: 'sport' },
  { field: 'gold' },
  { field: 'silver' },
  { field: 'bronze' },
];

var gridOptions = {
  defaultColDef: {
    width: 120,
    suppressFilter: true,
  },
  columnDefs: columnDefs,
  rowModelType: 'serverSide',
  cacheBlockSize: 100,
  maxBlocksInCache: 10,
  enableColResize: true,
  animateRows: true,
  debug: true,
};

document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json',
    })
    .then(function(data) {
      var idSequence = 0;
      data.forEach(function(item) {
        item.id = idSequence++;
      });

      gridOptions.api.showNoRowsOverlay();
      // ***** remove setTimeout for your application *****
      setTimeout(() => {
        var server = new FakeServer(data);
        var datasource = new ServerSideDatasource(server);
        gridOptions.api.setServerSideDatasource(datasource);
        gridOptions.api.hideOverlay()
      }, 1000);
    });
});

function ServerSideDatasource(server) {
  return {
    getRows(params) {
      setTimeout(function() {
        var response = server.getResponse(params.request);
        if (response.success) {
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 500);
    },
  };
}

function FakeServer(allData) {
  return {
    getResponse(request) {
      console.log(
        'asking for rows: ' + request.startRow + ' to ' + request.endRow
      );
      var rowsThisPage = allData.slice(request.startRow, request.endRow);
      var lastRow = allData.length <= request.endRow ? data.length : -1;
      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow,
      };
    },
  };
}
