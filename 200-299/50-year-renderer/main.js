var columnDefs = [
    {field: "athlete", width: 150},
    {field: "year", cellRenderer: 'yearRenderer', width: 90},
];

var gridOptions = {
    columnDefs: columnDefs,
    enableRangeSelection: true,
    rowData: null,
    components: {
        yearRenderer: YearRenderer
    }
};

function YearRenderer() { }

YearRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    switch (params.value) {
        case 2000:
            this.eGui.innerHTML = '<i class="fas fa-cat"></i>';
            break;
        case 2002:
            this.eGui.innerHTML = '<i class="fas fa-crow"></i>';
            break;
        case 2004:
            this.eGui.innerHTML = '<i class="fas fa-dog"></i>';
            break;
        case 2006:
            this.eGui.innerHTML = '<i class="fas fa-dragon"></i>';
            break;
        case 2008:
            this.eGui.innerHTML = '<i class="fas fa-spider"></i>';
            break;
        case 2010:
            this.eGui.innerHTML = '<i class="fas fa-hippo"></i>';
            break;
        case 2012:
            this.eGui.innerHTML = '<i class="fas fa-horse"></i>';
            break;
        default:
            this.eGui.innerHTML = '<i class="fas fa-frog"></i>';
            ;
    }
}

YearRenderer.prototype.getGui = function() {
    return this.eGui;
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
            gridOptions.api.setRowData(httpResult);
        }
    };
});
