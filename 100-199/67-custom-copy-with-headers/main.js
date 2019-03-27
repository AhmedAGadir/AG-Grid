// var columnDefs = [
//     { headerName: 'Athlete', field: 'athlete', width: 150 },
//     { headerName: 'Age', field: 'age', width: 90 },
//     { headerName: 'Country', field: 'country', width: 120 },
//     { headerName: 'Year', field: 'year', width: 90, },
//     { headerName: 'Date', field: 'date', width: 110 },
//     { headerName: 'Sport', field: 'sport', width: 110 },
//     { headerName: 'Gold', field: 'gold', width: 100 },
//     { headerName: 'Silver', field: 'silver', width: 100 },
//     { headerName: 'Bronze', field: 'bronze', width: 100 },
//     { headerName: 'Total', field: 'total', width: 100 }
// ];

var columnDefs = [
    { headerName: 'Athlete', field: 'athlete', width: 150 },
    { headerName: 'Age', field: 'age', width: 90 },
    { headerName: 'Country', field: 'country', width: 120, enableRowGroup: true, rowGroup: true },
    { headerName: 'Year', field: 'year', width: 90, enablePivot: true, pivot: true },
    { headerName: 'Date', field: 'date', width: 110 },
    { headerName: 'Sport', field: 'sport', width: 110, enablePivot: true, pivot: true },
    { headerName: 'Gold', field: 'gold', width: 100, enableValue: true, aggFunc: 'sum' },
    { headerName: 'Silver', field: 'silver', width: 100, enableValue: true, aggFunc: 'sum' },
    { headerName: 'Bronze', field: 'bronze', width: 100, enableValue: true, aggFunc: 'sum' },
];

var gridOptions = {
    columnDefs: columnDefs,
    enableRangeSelection: true,
    getContextMenuItems: getContextMenuItems,
    allowContextMenuWithControlKey: true,
    sideBar: true,
    pivotMode: true
};

function getContextMenuItems(params) {
    var result = [
        {
            // custom item
            name: 'Copy With Headers',
            action: function () {
                if (params.columnApi.isPivotMode()) {
                    var pivotKeysStr = params.column.colDef.pivotKeys.join('\n');
                    var aggregation = params.column.colDef.aggFunc + '(' + params.column.colDef.headerName + ')'
                    var cellContent = (params.value !== null && params.value !== undefined && params.value !== '') ? params.value : '\n';

                    var result = pivotKeysStr + '\n' + aggregation + '\n' + cellContent;
                    params.api.clipboardService.copyDataToClipboard(result);
                } else {
                    params.api.clipboardService.copyToClipboard(true)
                }
            },
        },
        // 'copyWithHeaders',
        'copy'
    ];

    return result;
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
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});