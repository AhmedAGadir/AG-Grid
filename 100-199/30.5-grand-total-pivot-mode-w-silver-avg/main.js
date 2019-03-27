var gridOptions = {
    columnDefs: [
        { headerName: 'Sport', field: 'sport', enableRowGroup: true, rowGroup: true },
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true },
        { headerName: 'Year', field: 'year', enablePivot: true, pivot: true },
        { headerName: 'Gold', field: 'gold', aggFunc: 'sum', enableValue: true },
        { headerName: 'Silver', field: 'silver', aggFunc: 'sum', enableValue: true },
        { headerName: 'Bronze', field: 'bronze', aggFunc: 'sum', enableValue: true },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    pivotMode: true,
    suppressAggFuncInHeader: true,
    // onColumnPivotChanged: params => {
    //     debugger
    // },
    // sideBar: true,
};

function addGrandTotal() {
    // Add a new column definition to colDefs 
    const colDefs = gridOptions.columnApi.getAllColumns().map(col => col.colDef);
    const customColDef = {
        headerName: 'Average Silver',
        field: 'row_total',
        cellRenderer: params => {
            let total = 0;
            let count = 0;
            params.columnApi.getSecondaryColumns().forEach(col => {
                let val = params.node.aggData[col.colId];
                if (col.colDef.headerName === 'Silver' && val) {
                    total += val;
                    count++
                }
            })
            let avg = total / count
            return Math.round(avg);
        },
        cellClass: 'row-total-style',
    }
    colDefs.push(customColDef);
    gridOptions.api.setColumnDefs(colDefs);

    // add new column to value columns
    const customColumn = gridOptions.columnApi.getColumn('row_total');
    gridOptions.columnApi.addValueColumn(customColumn)

    // pin one column and hide the others
    let pinned = false;
    gridOptions.columnApi.getAllGridColumns().forEach(column => {
        if (column.colDef.headerName === 'Average Silver') {
            if (!pinned) {
                gridOptions.columnApi.setColumnPinned(column, 'right');
                pinned = true;
            } else {
                gridOptions.columnApi.setColumnVisible(column, false);
            }
        }
    })
}

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

