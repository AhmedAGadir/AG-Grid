var columnDefs = [
    { headerName: "#", colId: "rowNum", valueGetter: "node.id", width: 40 },
    { headerName: "Athlete", field: "athlete", width: 150 },
    { headerName: "Age", field: "age", width: 90 },
    { headerName: "Country", field: "country", width: 120 },
    { headerName: "Year", field: "year", width: 90 },
    { headerName: "Date", field: "date", width: 110 },
    { headerName: "Sport", field: "sport", width: 110 },
    { headerName: "Gold", field: "gold", width: 100 },
    { headerName: "Silver", field: "silver", width: 100 },
    { headerName: "Bronze", field: "bronze", width: 100 },
    { headerName: "Total", field: "total", width: 100 }
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        cellClass: params => {
            var allColumns = params.node.columnApi.getAllGridColumns();
            return allColumns[1].colDef === params.colDef ? 'bkg-gold' : null
        }
    },
    rowData: null,
    enableColResize: true,
    onDragStopped: params => {
        params.api.redrawRows();
    }
};


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
