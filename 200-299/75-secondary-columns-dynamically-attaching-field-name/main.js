var columnDefs = [
    {
        headerName: 'Country',
        field: 'country',
        width: 120,
        rowGroup: true,
        enableRowGroup: true,
    },
    {
        headerName: 'Year',
        field: 'year',
        width: 90,
        pivot: true,
        enablePivot: true,
        pivotComparator: MyYearPivotComparator,
    },
    { headerName: 'Date', field: 'date', width: 110 },
    { headerName: 'Sport', field: 'sport', enablePivot: true, width: 110 },
    { headerName: 'Gold', field: 'gold', width: 100, aggFunc: 'sum' },
    { headerName: 'Silver', field: 'silver', width: 100, aggFunc: 'sum' },
    { headerName: 'Bronze', field: 'bronze', width: 100, aggFunc: 'sum' },
];

var gridOptions = {
    onGridReady: {
    },
    defaultColDef: {
        resizable: true,
        filter: true,
    },
    pivotMode: true,
    columnDefs: columnDefs,
    // we don't want the grid putting in 'sum' in the headers for us
    suppressAggFuncInHeader: true, //adsadsasd
    sideBar: true,

    // this is a callback that gets called on each column definition
    processSecondaryColDef: function(colDef) {
        // make all the columns upper case
        colDef.headerName = colDef.headerName.toUpperCase();

        // the pivot keys are the keys use for the pivot
        // don't change these, but you can use them for your information
        // console.log('Pivot Keys:');
        //console.log(colDef.pivotKeys);
        // the value column is the value we are aggregating on
        //console.log('Pivot Value Keys:');
        //console.log(colDef.pivotValueColumn);
    },

    // this is a callback that gets called on each group definition
    processSecondaryColGroupDef: function(colGroupDef) {
        colGroupDef.headerName = gridOptions.columnApi.getPivotColumns()[colGroupDef.pivotKeys.length - 1].colDef.headerName + ' *** ' + colGroupDef.headerName;
    },
};

function MyYearPivotComparator(a, b) {
    var requiredOrder = [
        '2012',
        '2010',
        '2008',
        '2006',
        '2004',
        '2002',
        '2000',
    ];
    return requiredOrder.indexOf(a) - requiredOrder.indexOf(b);
}

document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    var httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText).slice(0, 20);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
