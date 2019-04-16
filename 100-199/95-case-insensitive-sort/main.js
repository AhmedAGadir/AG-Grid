var columnDefs = [
    { field: 'id' },
    { headerName: 'athlete (w custom comparator)', field: 'athlete', comparator: customComparator },
    { headerName: 'country (w/ custom comparator)', field: 'country' },
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        sortable: true,
    },
    rowData: null,
    onFirstDataRendered: params => params.columnApi.autoSizeAllColumns(),
};

function customComparator(valA, valB, nodeA, nodeB, isInverted) {
    return valA.localeCompare(valB, 'en', { sensitivity: 'base' });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    gridOptions.api.setRowData([
        {
            athlete: 'michael phelps',
            country: 'UNITED STATES',
            id: 0,
        },
        {
            athlete: 'MICHAEL PHELPS',
            country: 'united states',
            id: 1,
        },
        {
            athlete: 'aleksey nemov',
            country: 'RUSSIA',
            id: 2,
        },
        {
            athlete: 'ALEKSEY NEMOV',
            country: 'russia',
            id: 3,
        },
        {
            athlete: 'ole einar bjørndalen',
            country: 'NORWAY',
            id: 4,
        },
        {
            athlete: 'OLE EINAR BJØRNDALEN',
            country: 'norway',
            id: 5,
        },
    ]);
});
