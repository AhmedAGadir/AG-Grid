var columnDefs = [
    {field: 'id'},
    {field: 'athlete', width: 150},
    {field: 'age'},
    {field: 'country'},
    {field: 'year'},
    {field: 'sport'},
    {field: 'gold'},
    {field: 'silver'},
    {field: 'bronze'}
];

var gridOptions = {
    defaultColDef: {
        width: 120,
        suppressFilter: true
    },
    columnDefs: columnDefs,

    // use the server-side row model
    rowModelType: 'serverSide',

    // fetch 100 rows per at a time
    cacheBlockSize: 100,

    // only keep 10 blocks of rows
    maxBlocksInCache: 10,
    enableColResize: true,
    animateRows: true,
    debug: true,
};

function setInitialRows(agGrid, gridApi) {
    agGrid.simpleHttpRequest({url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json'}).then(function(data) {
        // add id to data
        var idSequence = 0;
        data.forEach( function(item) {
          item.id = idSequence++;
        });

        var server = new FakeServer(data);
        var datasource = new ServerSideDatasource(server);
        gridApi.setServerSideDatasource(datasource);
    });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  for (let i = 1; i < 10; i++ ) {
    let gridDiv = document.querySelector('#myGrid' + i);
    let gridOptionsCopy = JSON.parse(JSON.stringify(gridOptions));
    new agGrid.Grid(gridDiv, gridOptionsCopy);
    gridOptionsCopy.api.showNoRowsOverlay();

    gridDiv.addEventListener('mouseover', (function IIFE() {
      let scrolledOver = false;
      return function(e) {
        if (!scrolledOver) {
          setInitialRows(agGrid, gridOptionsCopy.api);
          gridOptionsCopy.api.hideOverlay();
          scrolledOver = true;
        }
      }
    })())
  }
});

function ServerSideDatasource(server) {
  return {
    getRows(params) {
      // adding delay to simulate real sever call
      setTimeout(function () {

        var response = server.getResponse(params.request);

        if (response.success) {
          // call the success callback
          params.successCallback(response.rows, response.lastRow);
        } else {
          // inform the grid request failed
          params.failCallback();
        }

      }, 500);
    }
  };
}

function FakeServer(allData) {
  return {
    getResponse(request) {
      console.log('asking for rows: ' + request.startRow + ' to ' + request.endRow);

      // take a slice of the total rows
      var rowsThisPage = allData.slice(request.startRow, request.endRow);

      // if on or after the last page, work out the last row.
      var lastRow = allData.length <= request.endRow ? data.length : -1;

      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow
      };
    }
  };
}