var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', filter: "agTextColumnFilter" },
        { headerName: 'Country', field: 'country', filter: "agTextColumnFilter" },
        { headerName: 'Sport', field: 'sport', filter: "agTextColumnFilter" },
        { headerName: 'Age', field: 'age', filter: "agNumberColumnFilter" },
        { headerName: 'Year', field: 'year', filter: "agNumberColumnFilter" },
        { headerName: 'Date', field: 'date', filter: "agDateColumnFilter" },
        { headerName: 'Gold', field: 'gold', filter: "agNumberColumnFilter" },
        { headerName: 'Silver', field: 'silver', filter: "agNumberColumnFilter" },
        { headerName: 'Bronze', field: 'bronze', filter: "agNumberColumnFilter" },
        { headerName: 'Total', field: 'total', filter: "agNumberColumnFilter" }
    ],
    defaultColDef: {
        width: 150,
        filter: true,
    },
    rowData: null,
    floatingFilter: true
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        });
});
