const delay = ms => new Promise(res => setTimeout(res, ms));

// button click handler
async function setCountryFilters() {
  console.log('setting country filter values');
  var instance = gridOptions.api.getFilterInstance('country');
  let values = await getUpdatedCountryValuesAsync();
  instance.setFilterValues(values);
  gridOptions.api.onFilterChanged();
}

// button click handler
async function setSportFilters() {
  console.log('setting sport filter values');
  var instance = gridOptions.api.getFilterInstance('sport');
  let values = await getUpdatedSportValuesAsync();
  instance.setFilterValues(values);
  gridOptions.api.onFilterChanged();
}

var columnDefs = [
  {cellRenderer: params => params.node.rowIndex},
  {
    field: 'country',
    filter: 'agSetColumnFilter',
    filterParams: {
      values: getCountryValuesAsync,
    },
    menuTabs: ['filterMenuTab'],
  },
  {
    field: 'sport',
    filter: 'agSetColumnFilter',
    filterParams: {
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
  rowModelType: 'serverSide',
  cacheBlockSize: 100,
  maxBlocksInCache: 10,
  animateRows: true,
  // suppressScrollOnNewData: true
  // onFilterChanged: onFilterChanged,
};

var fakeServer;
var selectedCountries = null;

// function onFilterChanged() {
//   var countryFilterModel = gridOptions.api.getFilterModel()['country'];
//   var selected = countryFilterModel && countryFilterModel.values;

//   if (!areEqual(selectedCountries, selected)) {
//     selectedCountries = selected;

//     console.log('Refreshing sports filter');
//     var sportFilter = gridOptions.api.getFilterInstance('sport');
//     sportFilter.refreshFilterValues();
//   }
// }

// function areEqual(a, b) {
//   if (a == null && b == null) {
//     return true;
//   }
//   if (a != null || b != null) {
//     return false;
//   }

//   return (
//     a.length === b.length &&
//     a.every(function(v, i) {
//       return b[i] === v;
//     })
//   );
// }

// for getting initial country filter values
async function getCountryValuesAsync(params) {
  var countries = fakeServer.getCountries();

  await delay(500);
  params.success(countries);
}

// for getting initial sport filter values
async function getSportValuesAsync(params) {
  var sports = fakeServer.getSports(selectedCountries);

  await delay(500);
  params.success(sports);
}

// for getting updated country filter values
async function getUpdatedCountryValuesAsync(params) {
  var countries = fakeServer.getCountries();
  countries = ['Sudan'];

  await delay(500);
  return countries;
}

// for getting updated sport filter values
async function getUpdatedSportValuesAsync(params) {
  var sports = fakeServer.getSports(selectedCountries);
  sports = ['BJJ'];

  await delay(500);
  return sports;
}

function ServerSideDatasource(server) {
  this.server = server;
  this.resettingFilterValues = false;
}

ServerSideDatasource.prototype.getRows = function(params) {
  console.log('[Datasource] - rows requested by grid: ', params.request);
  console.log('resettingfiltervalues', this.resettingFilterValues);

  var response = this.server.getData(params.request);

  // simulating real server call with a 500ms delay
  setTimeout(async () => {
      if (response.success) {
        params.successCallback(response.rows, response.lastRow);
      } else {
        params.failCallback();
      }

      if (this.resettingFilterValues) {
        // prevents infinite loop
        this.resettingFilterValues = false;
        return;
      } else {
        // reset the filters after each getRows call
        this.resettingFilterValues = true;
        this.resetFilterValues();
      }
  }, 500);

};

ServerSideDatasource.prototype.resetFilterValues = async function() {
  // get scroll position
  // let topIndex = gridOptions.api.getFirstDisplayedRow();
  // console.log('topIndex', topIndex);

  // set country filters
  var instance = gridOptions.api.getFilterInstance('country');
  let countryValues = await getUpdatedCountryValuesAsync();
  instance.setFilterValues(countryValues);

  // set sports filters
  var instance = gridOptions.api.getFilterInstance('sport');
  let sportValues = await getUpdatedSportValuesAsync();
  instance.setFilterValues(sportValues);

  // update
  console.log('onFilterChanged');
  gridOptions.api.onFilterChanged();

  // reset scroll position
  // setTimeout(() => {
  // console.log('resetting scroll position')
  //   gridOptions.api.ensureIndexVisible(topIndex === 0 ? topIndex : topIndex + 10, 'top');
  // }, 1000);

};

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
      fakeServer = new FakeServer(data);

      // create datasource with a reference to the fake server
      var datasource = new ServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridOptions.api.setServerSideDatasource(datasource);
    });
});
