var columnDefs = [
    {
        headerName: 'Country',
        field: 'country',
        width: 120,
        rowGroup: true,
        enableRowGroup: true,
    },
    { headerName: 'Year', field: 'year', width: 90 },
    {
        headerName: 'Date',
        field: 'date',
        valueGetter: params => {
            return params.data.date.replace(/T\d{2}:\d{2}:\d{2}$/, '');
        },
        width: 110,
        pivot: true,
        enablePivot: true,
    },
    { headerName: 'Sport', field: 'sport', width: 110 },
    { headerName: 'Gold', field: 'gold', width: 100, aggFunc: 'sum' },
    { headerName: 'Silver', field: 'silver', width: 100, aggFunc: 'sum' },
    { headerName: 'Bronze', field: 'bronze', width: 100, aggFunc: 'sum' },
];

var gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,
    },
    // set rowData to null or undefined to show loading panel by default
    pivotMode: true,
    columnDefs: columnDefs,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
