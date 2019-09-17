const store = {
    values: ['Arm', 'Bam', 'Dave', 'Shub' ]
}

function getValues() {
    return store.values;
}

function onCellValueChanged(params) {
    store.values.push('Bert');
}

var columnDefs = [
    {
        field: "athlete", 
        cellEditor: 'agRichSelectCellEditor', 
        cellEditorParams: {
            values: getValues(),
        },
        width: 150
    },
    {field: "age", width: 90},
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        editable: true
    },
    rowData: null,
    onCellValueChanged: onCellValueChanged
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
