var columnDefs = [
    {
        headerName: "Gold", 
        field: "gold", 
        width: 100, 
        aggFunc: 'sum', 
        valueFormatter: params => {
            return params.node.group ? params.value : '#';
        }
    },
    {
        headerName: "Country", 
        field: "country", 
        width: 120, 
        rowGroup: true, 
        hide: true
    },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    enableSorting: true,
    autoGroupColumnDef: {headerName: "Athlete",
        field: "athlete",
        width: 200,
        cellRenderer:'agGroupCellRenderer',
        cellRendererParams: {
            footerValueGetter: '"Total (" + x + ")"',
            padding: 5
        }}
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
