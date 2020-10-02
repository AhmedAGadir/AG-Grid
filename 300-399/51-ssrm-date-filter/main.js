var gridOptions = {
  columnDefs: [
    {
      field: 'athlete',
      filter: 'agTextColumnFilter',
      minWidth: 220,
    },
    {
      field: 'date',
      filter: 'agDateColumnFilter',

      // add extra parameters for the date filter
      filterParams: {
        debounceMs: 1000,
        // provide comparator function
        comparator: function(filterLocalDateAtMidnight, cellValue) {
          var dateAsString = cellValue;

          if (dateAsString == null) {
            return 0;
          }

          // In the example application, dates are stored as dd/mm/yyyy
          // We create a Date object for comparison against the filter date
          var dateParts = dateAsString.split('/');
          var day = Number(dateParts[2]);
          var month = Number(dateParts[1]) - 1;
          var year = Number(dateParts[0]);
          var cellDate = new Date(day, month, year);

          // Now that both parameters are Date objects, we can compare
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          } else {
            return 0;
          }
        },
      },
      minWidth:200,
    },
    {
      field: 'year',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset'],
        debounceMs: 1000,
        suppressAndOrCondition: true,
      },
    },
    { field: 'gold', type: 'number' },
    { field: 'silver', type: 'number' },
    { field: 'bronze', type: 'number' },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    sortable: true,
    resizable: true,
    menuTabs: ['filterMenuTab'],
  },
  columnTypes: {
    number: { filter: 'agNumberColumnFilter' },
  },
  // use the server-side row model
  rowModelType: 'serverSide',
  floatingFilter: true,
  animateRows: true,
  // debug: true
};

function ServerSideDatasource(server) {
  return {
    getRows: function(params) {
      console.log('[Datasource] - rows requested by grid: ', params.request);

      // get data for request from our fake server
      var response = server.getData(params.request);

      // simulating real server call with a 500ms delay
      setTimeout(function() {
        if (response.success) {
          // supply rows for requested block to grid
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 500);
    },
  };
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json',
    })
    .then(function(data) {
      // setup the fake server with entire dataset
      var fakeServer = new FakeServer(data);

      // create datasource with a reference to the fake server
      var datasource = new ServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridOptions.api.setServerSideDatasource(datasource);
    });
});
