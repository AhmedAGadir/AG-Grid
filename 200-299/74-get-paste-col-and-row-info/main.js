var columnDefs = [
    {field: "athlete", width: 150},
    {field: "age", width: 90},
    {field: "country", width: 120},
    {field: "year", width: 90},
    {field: "date", width: 110},
    {field: "sport", width: 110},
    {field: "gold", width: 100},
    {field: "silver", width: 100},
    {field: "bronze", width: 100},
    {field: "total", width: 100}
];

let pasteDetails = {
    columns: [],
    rowIndexes: []
}

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        editable: true
    },
    enableRangeSelection: true,
    rowData: null,
    onPasteEnd: params => {
        document.querySelector('#pasteColumns').innerHTML = pasteDetails.columns.join(', ');
        document.querySelector('#pasteIndexes').innerHTML = pasteDetails.rowIndexes.join(', ');

        pasteDetails.columns = [];
        pasteDetails.rowIndexes = [];
    },
    processCellFromClipboard: params => {
        let colId = params.column.colId;
        let rowIndex = params.node.rowIndex;

        if (!pasteDetails.columns.includes(colId)) {
            pasteDetails.columns.push(colId);
        }
        if (!pasteDetails.rowIndexes.includes(rowIndex)) {
            pasteDetails.rowIndexes.push(rowIndex);
        }
        return params.value;
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
