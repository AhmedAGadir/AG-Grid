var gridOptions = {
    columnDefs: [
        { headerName: 'Sport', field: 'sport', enableRowGroup: true, rowGroup: true },
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true },
        { headerName: 'Gold', field: 'gold', aggFunc: 'sum', enableValue: true },
        { headerName: 'Silver', field: 'silver', aggFunc: 'sum', enableValue: true },
        { headerName: 'Bronze', field: 'bronze', aggFunc: 'sum', enableValue: true },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    pivotMode: true,
    // sideBar: true,
    // onColumnPivotChanged: params => {
    //     debugger
    // },
    // onFirstDataRendered: params => {
    //     debugger
    // }
};

function addSecondaryColumn() {
    // Add a new column definition to colDefs 
    const colDefs = gridOptions.columnApi.getAllColumns().map(col => col.colDef);
    const customColDef = {
        headerName: 'Custom Column',
        field: 'customColumn',
        cellRenderer: params => 'yo'
    }
    colDefs.push(customColDef);
    gridOptions.api.setColumnDefs(colDefs);

    // pivot by that new column
    const customColumn = gridOptions.columnApi.getColumn('customColumn');
    debugger;
    // gridOptions.columnApi.columnController.setPivotColumns([year]);
}

// const colDefs = gridOptions.columnApi.getAllColumns().map(col => col.colDef);
//     colDefs.push({field: colKey});

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

