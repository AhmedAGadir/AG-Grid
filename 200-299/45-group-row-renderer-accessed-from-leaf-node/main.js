const COUNTRIES = [
    'Ireland',
    'United States',
    'Russia',
    'Australia',
    'Canada',
    'Norway',
    'China',
    'Zimbabwe',
    'Netherlands',
    'South Korea',
    'Croatia',
    'France',
];

var columnDefs = [
    { headerName: 'Country', field: 'country' , rowGroup: true, hide: true },
    { headerName: 'Athlete', field: 'athlete'  },
    { headerName: 'Toggle Flag', cellRenderer: 'myCellRenderer' },
    { headerName: 'Year', field: 'year'}
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    groupUseEntireRow: true,
    components: {
        groupRowInnerRenderer: GroupRowInnerRenderer,
        myCellRenderer: MyCellRenderer,
    },
    groupRowInnerRenderer: 'groupRowInnerRenderer',
    groupRowRendererParams: {
        suppressCount: true,
        flagCodes: {
            Ireland: 'ie',
            'United States': 'us',
            Russia: 'ru',
            Australia: 'au',
            Canada: 'ca',
            Norway: 'no',
            China: 'cn',
            Zimbabwe: 'zw',
            Netherlands: 'nl',
            'South Korea': 'kr',
            Croatia: 'hr',
            France: 'fr',
        },
    },
    onGridReady: params => params.api.sizeColumnsToFit()
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText).slice(0, 100);
            var rowData = httpResult.filter(row =>
                COUNTRIES.includes(row.country)
            );
            gridOptions.api.setRowData(rowData);
        }
    };
});
