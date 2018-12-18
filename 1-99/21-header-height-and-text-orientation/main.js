var columnDefs = [
    {
        headerName: "Athlete Details",
        children: [
            {headerName: "Gooooooooooooooooold", field: "gold", width: 60, enableValue: true,
                suppressMenu:true, filter:'agNumberColumnFilter', aggFunc: 'sum'},
            {headerName: "Silver", field: "silver", width: 60, enableValue: true,
                suppressMenu:true, filter:'agNumberColumnFilter', aggFunc: 'sum'}
        ]
    }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    enableColResize: true,
    // groupHeaderHeight:75,
    headerHeight: 150,
    // floatingFiltersHeight:50,
    // pivotGroupHeaderHeight:50,
    // pivotHeaderHeight:100,
   // showToolPanel:true
};

document.querySelector('#vertical').addEventListener('click', () => {
    Array.from(document.querySelectorAll('.ag-header-cell-label .ag-header-cell-text')).forEach(header => header.style.writingMode = 'vertical-lr')
})

document.querySelector('#horizontal').addEventListener('click', () => {
    Array.from(document.querySelectorAll('.ag-header-cell-label .ag-header-cell-text')).forEach(header => header.style.writingMode = 'horizontal-tb')
})

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
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
