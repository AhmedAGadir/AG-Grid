var count = 0;
var columnDefs = [
  {
    field: 'country',
    filter: 'agSetColumnFilter',
    filterParams: {
      buttons: ['reset'],
      refreshValuesOnOpen: true,
      values: getCountryValuesAsync,
    },
    menuTabs: ['filterMenuTab'],
  },
  {
    field: 'sport',
    filter: 'agSetColumnFilter',
    filterParams: {
      buttons: ['reset'],
      refreshValuesOnOpen: true,
      values: getSportValuesAsync,
    },
    menuTabs: ['filterMenuTab'],
  },
  { field: 'athlete', menuTabs: false },
];

var gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    sortable: true,
    resizable: true,
  },
  // use the server-side row model
  rowModelType: 'serverSide',
  serverSideStoreType: 'partial',

  // fetch 100 rows at a time
  cacheBlockSize: 100,

  // only keep 10 blocks of rows
  maxBlocksInCache: 10,

  animateRows: true,
  // debug: true

  // onFilterChanged: onFilterChanged,
};

var fakeServer;
var selectedCountries = null;

// function onFilterChanged(params) {
//   console.log('onFilterChanged', params.api.getFilterModel());
//   // var countryFilterModel = gridOptions.api.getFilterModel()['country'];
//   // var selected = countryFilterModel && countryFilterModel.values;

//   // if (!areEqual(selectedCountries, selected)) {
//   //   selectedCountries = selected;

//   //   console.log('Refreshing sports filter');
//   //   var sportFilter = gridOptions.api.getFilterInstance('sport');
//   //   sportFilter.refreshFilterValues();
//   // }
// }

function areEqual(a, b) {
  if (a == null && b == null) {
    return true;
  }
  if (a != null || b != null) {
    return false;
  }

  return (
    a.length === b.length &&
    a.every(function (v, i) {
      return b[i] === v;
    })
  );
}

function getCountryValuesAsync(params) {
  var countries = fakeServer.getCountries();
  // simulating real server call with a 500ms delay
  setTimeout(function () {
    if(count > 1 ){
        //  console.log('####%%#');
         params.success(['Afghanistan']);
    }else{
    params.success(countries);
    }
    count++;

    // console.log(count);
    // console.log(countries)
  }, 500);
}

function getSportValuesAsync(params) {
  var sports = fakeServer.getSports(selectedCountries);

  // simulating real server call with a 500ms delay
  setTimeout(function () {
    params.success(sports);
  }, 500);
}

function ServerSideDatasource(server) {
  return {
    getRows: function (params) {
      // console.log('[%%%%%%Datasource] - rows requested by grid: ', params.request);

      let filtermodel = {};
      params.columnApi.getAllColumns().forEach((col) => {
        if (!col.colDef.filter) {
          return;
        }
        let filterInstance = params.api.getFilterInstance(col.colId);
        let filterValues = filterInstance.getValues();
        if (filterValues && filterValues.length > 0) {
          let selectedValues = [];
          filterValues.forEach((filterValue) => {
            if (filterInstance.isValueSelected(filterValue)) {
              selectedValues.push(filterValue);
            }
          });

          filtermodel[col.colId] = {
            filterType: 'set',
            values: selectedValues,
          };
        }
      });

      console.log('modified filter model', filtermodel);
      console.log('actual filter model', params.request.filterModel);

      params.request.filterModel = filtermodel;

      // get data for request from our fake server
      var response = server.getData(params.request);

      // simulating real server call with a 500ms delay
      setTimeout(function () {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 500);
    },
  };
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url: 'https://www.ag-grid.com/example-assets/olympic-winners.json',
    })
    .then(function (data) {
      // setup the fake server with entire dataset
      fakeServer = new FakeServer(data);

      // create datasource with a reference to the fake server
      var datasource = new ServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridOptions.api.setServerSideDatasource(datasource);
    });
});
