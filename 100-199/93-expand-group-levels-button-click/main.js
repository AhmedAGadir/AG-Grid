var columnDefs = [
    { headerName: "Country", field: "country", width: 120, rowGroup: true, hide: true },
    { headerName: "Sport", field: "sport", width: 110, rowGroup: true, hide: true },
    { headerName: "Year", field: "year", width: 90, rowGroup: true, hide: true },
    { headerName: "Age", field: "age", width: 90, rowGroup: true, hide: true },
    { headerName: "Athlete", field: "athlete", width: 200 },
    { headerName: "Gold", field: "gold", width: 100 },
    { headerName: "Silver", field: "silver", width: 100 },
    { headerName: "Bronze", field: "bronze", width: 100 },
    { headerName: "Total", field: "total", width: 100 },
    { headerName: "Date", field: "date", width: 110 }
];

var gridOptions = {
    defaultColDef: {
        sortable: true
    },
    columnDefs: columnDefs,
    animateRows: true,
    enableRangeSelection: true,
    rowData: null,
    groupMultiAutoColumn: true
};

function expandGroup(level) {
    gridOptions.api.forEachNode(node => {
        if (node.group) {
            let shouldExpand = node.level <= level;
            if (shouldExpand && node.expanded || !shouldExpand && !node.expanded) {
                return;
            }
            node.setExpanded(shouldExpand);
        }
    })
}

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
            gridOptions.api.setRowData(httpResult.slice(0, 100));
        }
    };
});
