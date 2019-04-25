var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true, enableValue: true, aggFunc: 'sum' },
        { headerName: 'Sport', field: 'sport', enablePivot: true, pivot: true },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Silver', field: 'silver', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Bronze', field: 'bronze', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Total', field: 'total' }
    ],
    defaultColDef: {
        width: 150,
    },
    autoGroupColumnDef: {
        width: 250,
        valueGetter: params => {
            console.log(params.node.group)
            if (params.node.group) {
                // debugger;
            }
        },
        // valueSetter: params => {
        //     // debugger;

        //     return true
        // },
        cellRendererParams: {
            // innerRenderer: params => {
            //     // debugger;
            // },
        }
    },
    rowData: null,
    sideBar: true,
    // pivotMode: true,
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

