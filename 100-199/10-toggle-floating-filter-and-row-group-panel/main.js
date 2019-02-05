
var columnDefs = [
    { headerName: "Athlete", field: "athlete", width: 150, filter: 'agTextColumnFilter' },
    { headerName: "Age", field: "age", width: 90, filter: 'agNumberColumnFilter' },
    { headerName: "Country", field: "country", width: 120, filter: 'agTextColumnFilter', enableRowGroup: true },
    { headerName: "Year", field: "year", width: 90, filter: 'agNumberColumnFilter', enableRowGroup: true },
    { headerName: "Date", field: "date", width: 145 }, // filter: 'agDateColumnFilter'
    { headerName: "Sport", field: "sport", width: 110, enableRowGroup: true },
    { headerName: "Gold", field: "gold", width: 100, filter: 'agNumberColumnFilter' },
    { headerName: "Silver", field: "silver", width: 100, filter: 'agNumberColumnFilter' },
    { headerName: "Bronze", field: "bronze", width: 100, filter: 'agNumberColumnFilter' },
    { headerName: "Total", field: "total", width: 100, filter: 'agNumberColumnFilter' }
];

var gridOptions = {
    defaultColDef: {
        filter: 'agTextColumnFilter',
    },
    floatingFilter: true,
    columnDefs: columnDefs,
    rowData: null,
    sideBar: true,
    rowGroupPanelShow: 'always',
    onColumnRowGroupChanged: () => {
        // grid sometimes shows the input fields again (weird)
        if (!showFloatingFilter) {
            showFloatingFilter = !showFloatingFilter;
            toggleFloatingFilter();
        }
    }
};

let showFloatingFilter = true
function toggleFloatingFilter() {
    //clear all floating filters
    gridOptions.api.setFilterModel({});

    // toggle floating filter height
    gridOptions.api.setFloatingFiltersHeight(showFloatingFilter ? 0 : 32); // default height is 32px

    // show/hide DOM elements 
    let floatingInputFields = document.querySelectorAll('.ag-header-container .ag-header-row:nth-of-type(2) input')
    for (let input of floatingInputFields) {
        input.style.display = showFloatingFilter ? 'none' : 'block';
    }
    showFloatingFilter = !showFloatingFilter;
}

let showRowGroupPanel = true;
function toggleRowGroupPanel() {
    // remove all row groups first
    var rowGroupColumnKeys = gridOptions.columnApi.getRowGroupColumns().map(rowGroup => rowGroup.colId);
    gridOptions.columnApi.removeRowGroupColumns(rowGroupColumnKeys);

    // show/hide DOM element
    document.querySelector('.ag-column-drop-row-group').style.display = showRowGroupPanel ? 'none' : 'block';
    showRowGroupPanel = !showRowGroupPanel;
}


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});


