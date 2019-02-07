var columnDefs = [
    { headerName: 'Athlete', field: 'athlete', width: 150 },
    {
        headerName: 'Index',
        field: 'index',
        width: 90,
        filter: 'agNumberColumnFilter',
        filterParams: {
            inRangeInclusive: true
        }
    },
];

var gridOptions = {
    defaultColDef: {
        filter: true,
    },
    columnDefs: columnDefs,
    rowData: null,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    var httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            httpResult.forEach((row, ind) => row.index = ind);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
