var columnDefs = [
    {headerName: "Country", field: "country", width: 120, rowGroup:true, enableRowGroup: true},
    {headerName: "Year", field: "year", width: 90, rowGroup:true, enableRowGroup: true},
    {headerName: "Sport", field: "sport", width: 110, enableRowGroup: true},
    {headerName: "Athlete", field: "athlete", width: 200},
    {headerName: "Gold", field: "gold", width: 100},
    {headerName: "Silver", field: "silver", width: 100},
    {headerName: "Bronze", field: "bronze", width: 100},
    {headerName: "Total", field: "total", width: 100},
    {headerName: "Age", field: "age", width: 90},
    {headerName: "Date", field: "date", width: 110}
];

var gridOptions = {
    columnDefs: columnDefs,
    autoGroupColumnDef: {
       headerComponent: 'customHeader',
       enablePivot: true,
    },
    components: {
        customHeader: CustomHeader
    },
    animateRows: true,
    enableRangeSelection: true,
    rowData: null,
    enableSorting:true,
    enableFilter:true,
    enablePivot: true,
    sideBar: true
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

function CustomHeader() {
}

CustomHeader.prototype.init = function (agParams) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = agParams.columnApi.getRowGroupColumns().map(rowGroup => rowGroup.colId).join(' -> ')
};

CustomHeader.prototype.getGui = function () {
    return this.eGui;
};

CustomHeader.prototype.destroy = function () {
};
