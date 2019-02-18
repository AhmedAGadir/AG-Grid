var columnDefs = [
    {
        headerName: 'Athlete Details',
        children: [
            { headerName: 'Athlete', field: 'athlete' },
            { headerName: 'Age', field: 'age' },
            { headerName: 'Country', field: 'country' }
        ]
    },
    { headerName: 'Year', field: 'year' },
    { headerName: 'Date', field: 'date' },
    {
        headerName: 'Sports Results',
        children: [
            { headerName: 'Sport', field: 'sport' },
            { headerName: 'Total', columnGroupShow: 'closed', field: 'total' },
            { headerName: 'Gold', columnGroupShow: 'open', field: 'gold' },
            { headerName: 'Silver', columnGroupShow: 'open', field: 'silver' },
            { headerName: 'Bronze', columnGroupShow: 'open', field: 'bronze' }
        ]
    },
    { headerName: 'Year', field: 'year' },
    {
        headerName: 'Athlete Details',
        children: [
            { headerName: 'Athlete', field: 'athlete' },
            { headerName: 'Age', field: 'age' },
            { headerName: 'Country', field: 'country' }
        ]
    },
    { headerName: 'Date', field: 'date' },
    { headerName: 'Year', field: 'year' },
    { headerName: 'Date', field: 'date' }
];

var gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true
    },
    debug: true,
    columnDefs: columnDefs,
    rowData: null,
    onGridReady: params => params.api.sizeColumnsToFit()
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json' }).then(function (data) {
        gridOptions.api.setRowData(data);
    });
});