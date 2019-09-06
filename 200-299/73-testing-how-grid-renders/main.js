var columnDefs = [
    {field: "athlete", width: 150},
    {field: "age", width: 90},
    {field: "country", width: 120},
    {field: "year", width: 90},
    {field: "date", width: 110},
    {field: "sport", width: 110},
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        cellRenderer: MyCellRenderer
    },
    enableRangeSelection: true,
    rowData: null
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
            gridOptions.api.setRowData(httpResult.slice(0,10));
        }
    };
});

let timeoutMs = 500;

function MyCellRenderer() {}

MyCellRenderer.prototype.init = function(params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = '';
}

MyCellRenderer.prototype.getGui = function() {
    setTimeout(() => {
        this.showValue();
    }, timeoutMs);
    timeoutMs += 500
    return this.eGui;
}

MyCellRenderer.prototype.showValue = function() {
    this.eGui.innerHTML = this.params.value;
}