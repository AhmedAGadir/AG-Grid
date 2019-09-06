var columnDefs = [
    {headerName: "Country", field: "country", width: 120, rowGroup: true, enableRowGroup:true},
    {headerName: "Year", field: "year", width: 90, pivot: true, enablePivot:true},
    {headerName: "Date", field: "date", width: 110},
    {headerName: "Sport", field: "sport", width: 110},
    {headerName: "Total", field: "total", width: 100, aggFunc: customAggFunc}
];

var gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,
        comparator: myComparator
    },
    pivotMode: true,
    sideBar: true,
    columnDefs: columnDefs,
    
};

function customAggFunc(arr) {
    if (arr.length === 0) {
        return 0;
    }
    let sum = arr.reduce((a,b) => a + b);
    // sum array and randomly make some of the sums negative
    return Math.random() < 0.5 ? -1 * sum : sum;
}

function myComparator(valueA, valueB, nodeA, nodeB, isInverted) {
   let result = Math.abs(valueB) - Math.abs(valueA);
      if (result === 0){
        result = valueA < 0 ? 1: -1;
      }
    return result; 
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});