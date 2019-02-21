var columnDefs = [
    {field: 'athlete'}

];

var gridOptions = {
    defaultColDef: {
        resizable: true,
        editable: true,
    },
    columnDefs: columnDefs,
    rowData: null,
};

document.querySelector('#myForm').addEventListener('submit', addColumn);

function addColumn(e) {
    e.preventDefault();
    const colKey = new FormData(e.target).get('colKey');
    const colDefs = gridOptions.columnApi.getAllColumns().map(col => col.colDef);
    colDefs.push({field: colKey});
    gridOptions.api.setColumnDefs(colDefs);
}

function saveChanges() {
    const updatedRows = [];
    gridOptions.api.forEachNode(node => updatedRows.push(node.data));
    console.log('updatedRows', updatedRows);
    // send updatedRows to backend 
}

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
            var rowData = httpResult.slice(0,10).map(row => ({athlete: row.athlete}));
            gridOptions.api.setRowData(rowData);
        }
    };
});
