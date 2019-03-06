// solution is to just add colId's to each columnDef, otherwise they alternate between e.g. 'athlete' and 'athlete_1'

var columnDefs = [
    { headerName: 'Athlete', field: 'athlete', colId: 'athlete', width: 150, filter: 'agTextColumnFilter' },
    { headerName: 'Age', field: 'age', colId: 'age', width: 90, filter: 'agNumberColumnFilter' },
    { headerName: 'Country', field: 'country', colId: 'country', width: 120 },
    { headerName: 'Year', field: 'year', colId: 'year', width: 90 },
    { headerName: 'Sport', field: 'sport', colId: 'sport', width: 110 },
    { headerName: 'Gold', field: 'gold', colId: 'gold', width: 100, filter: 'agNumberColumnFilter' },
    { headerName: 'Silver', field: 'silver', colId: 'silver', width: 100, filter: 'agNumberColumnFilter' },
    { headerName: 'Bronze', field: 'bronze', colId: 'bronze', width: 100, filter: 'agNumberColumnFilter' },
    { headerName: 'Total', field: 'total', colId: 'total', width: 100, filter: 'agNumberColumnFilter' }
];

var columnDefs2 = [
    { headerName: 'Athlete', field: 'athlete', colId: 'athlete', width: 150, filter: 'agTextColumnFilter' },
    { headerName: 'Age', field: 'age', colId: 'age', width: 90, filter: 'agNumberColumnFilter' },
    { headerName: 'Country', field: 'country', colId: 'country', width: 120 },
    { headerName: 'Year', field: 'year', colId: 'year', width: 90 },
    { headerName: 'Sport', field: 'sport', colId: 'sport', width: 110 },
    { headerName: 'Gold', field: 'gold', colId: 'gold', width: 100, filter: 'agNumberColumnFilter' },
    { headerName: 'Silver', field: 'silver', colId: 'silver', width: 100, filter: 'agNumberColumnFilter' },
    { headerName: 'Bronze', field: 'bronze', colId: 'bronze', width: 100, filter: 'agNumberColumnFilter' },
];

var gridOptions = {
    defaultColDef: {
        sortable: true,
        filter: true
    },
    columnDefs: columnDefs,
    rowData: null,
    onColumnEverythingChanged: params => {
        console.log(params.columnApi.getAllDisplayedColumns().map(col => col.colId))
    }
};

function clearFilters() {
    gridOptions.api.setFilterModel(null);
    gridOptions.api.onFilterChanged();
}

function saveFilterModel() {
    var savedFilters = '[]';
    window.savedModel = gridOptions.api.getFilterModel();
    if (window.savedModel) {
        savedFilters = Object.keys(window.savedModel);
    } else {
        savedFilters = '-none-';
    }
    document.querySelector('#savedFilters').innerHTML = JSON.stringify(savedFilters);
}

function restoreFilterModel() {
    gridOptions.api.setFilterModel(window.savedModel);
    gridOptions.api.onFilterChanged();
}

function restoreFromHardCoded() {
    gridOptions.api.setColumnDefs(columnDefs2);
    var hardcodedFilter = {
        country: ['Ireland', 'United States'],
        age: { type: 'lessThan', filter: '30' },
        athlete: { type: 'startsWith', filter: 'Mich' },
        date: { type: 'lessThan', dateFrom: '2010-01-01' }
    };
    gridOptions.api.setFilterModel(hardcodedFilter);
    gridOptions.api.onFilterChanged();
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
