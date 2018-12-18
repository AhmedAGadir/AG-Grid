var columnDefs = [
    {
        headerName: 'Gold',
        field: 'gold',
        width: 100,
        aggFunc: 'sum',
        enableValue: true,
        allowedAggFuncs: ['sum', 'min', 'max'],
        cellClassRules: {
            'gold-gold': params => params.node.group && params.value >= 200,
            'medium-gold': params => params.node.group && params.value >= 100 && params.value < 200,
            'light-gold': params => params.node.group && params.value <= 100
        }
    },
    {
        headerName: 'Silver',
        field: 'silver',
        width: 100,
        aggFunc: 'min',
        enableValue: true,
    },
    {
        headerName: 'Bronze',
        field: 'bronze',
        width: 100,
        aggFunc: 'max',
        enableValue: true,
    },
    {
        headerName: 'Total',
        field: 'total',
        width: 100,
        aggFunc: 'avg',
        enableValue: true,
    },
    { headerName: 'Age', field: 'age', width: 90 },
    { headerName: 'Country', field: 'country', width: 120, rowGroup: true },
    { headerName: 'Year', field: 'year', width: 90 },
    { headerName: 'Date', field: 'date', width: 110 },
    { headerName: 'Sport', field: 'sport', width: 110 },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    groupIncludeFooter: true,
    enableSorting: true,
    sideBar: true,
    toolPanelSuppressPivots: true,
    toolPanelSuppressPivotMode: true,
    autoGroupColumnDef: {
        headerName: 'Athlete',
        field: 'athlete',
        width: 200,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            footerValueGetter: '"Total (" + x + ")"',
            padding: 5,
        },
    },
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
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
