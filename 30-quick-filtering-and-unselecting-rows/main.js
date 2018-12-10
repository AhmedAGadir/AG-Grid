var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
    },
    { headerName: 'Age', field: 'age' },
    { headerName: 'Country', field: 'country' },
    { headerName: 'Year', field: 'year' },
    { headerName: 'Date', field: 'date' },
    { headerName: 'Sport', field: 'sport' },
    { headerName: 'Gold', field: 'gold' },
    { headerName: 'Silver', field: 'silver' },
    { headerName: 'Bronze', field: 'bronze' },
    { headerName: 'Total', field: 'total' },
];

var gridOptions = {
    defaultColDef: {
        width: 100,
    },
    enableColResize: true,
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
    columnDefs: columnDefs,
};

function onQuickFilterChanged() {
    let val = document.getElementById('quickFilter').value;
    // set the filter
    gridOptions.api.setQuickFilter(val);

    // loop through selected nodes
    gridOptions.api.getSelectedNodes().forEach(node => {
        // if any field in the node contains the filtered text, then return
        if (Object.values(node.data).some(field => field.toString().toLowerCase().includes(val.toLowerCase()))) {
            return;
        } else {
            // otherwise unselect the row
            node.setSelected(false)
        }
    });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open(
        'GET',
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});
