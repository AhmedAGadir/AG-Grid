var columnDefs = [
    { headerName: 'Country', field: 'country', width: 120, rowGroup: true },
    { headerName: 'Year', field: 'year', width: 90 },
    { headerName: 'Sport', field: 'sport', width: 110 },
    { headerName: 'Athlete', field: 'athlete', width: 200 },
    { headerName: 'Gold', field: 'gold', width: 100 },
    { headerName: 'Silver', field: 'silver', width: 100 },
    { headerName: 'Bronze', field: 'bronze', width: 100 },
    { headerName: 'Total', field: 'total', width: 100 },
    { headerName: 'Age', field: 'age', width: 90 },
    { headerName: 'Date', field: 'date', width: 110 },
];

var gridOptions = {
    columnDefs: columnDefs,
    animateRows: true,
    enableRangeSelection: true,
    rowData: null,
    enableSorting: true,
    enableFilter: true,
    groupSuppressRow: true,
    defaultColDef: {
        cellStyle: params => {
            // added this property onto the node to stop the cell from restyling when scrolled out of view and then back into view
            if (params.node.alreadyStyled) {
                return params.node.alreadyStyled;
            }
            if (params.data.country !== prevCountry && params.node.rowIndex !== 0) {
                currentCellStyle = currentCellStyle === evenRowStyle ? oddRowStyle : evenRowStyle;
            }
            prevCountry = params.data.country;
            params.node.alreadyStyled = currentCellStyle;
            return currentCellStyle;
        },
    },
};

let evenRowStyle = {
    background: 'lightblue'
}
let oddRowStyle = {
    background: 'gold'
}

let currentCellStyle = evenRowStyle;
let prevCountry;

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
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
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult.slice(0, 300));
        }
    };
});
