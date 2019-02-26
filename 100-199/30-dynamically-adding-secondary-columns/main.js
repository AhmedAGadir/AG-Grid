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
        headerGroupComponent: myHeaderGroupComponent
    },
    rowData: null,
    pivotMode: true,
    // sideBar: true,
    suppressAggFuncInHeader: true,
    // onColumnPivotChanged: params => {
    //     debugger
    // },
    // onFirstDataRendered: params => {
    //     debugger
    // }
};

function addGrandTotal() {
    // Add a new column definition to colDefs 
    const colDefs = gridOptions.columnApi.getAllColumns().map(col => col.colDef);
    const customColDef = {
        headerName: 'Row Total',
        field: 'row_total',
        cellRenderer: params => Object.values(params.node.aggData).reduce((a, b) => a + b),
        cellClass: 'row-total-style'
    }
    colDefs.push(customColDef);
    gridOptions.api.setColumnDefs(colDefs);


    // add new column to value columns
    const customColumn = gridOptions.columnApi.getColumn('row_total');
    gridOptions.columnApi.addValueColumn(customColumn)

    // hide unwanted ones
    let pinned = false;
    gridOptions.columnApi.getAllGridColumns().forEach(column => {
        if (column.colDef.headerName === 'Row Total') {
            if (!pinned) {
                gridOptions.columnApi.setColumnPinned(column, 'right');
                pinned = true;
            } else {
                gridOptions.columnApi.setColumnVisible(column, false);
            }
        }
    })

}

function myHeaderGroupComponent() { }

myHeaderGroupComponent.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    debugger;
    this.eGui.innerHTML = 'yo'
}

myHeaderGroupComponent.prototype.getGui = function () {
    return this.eGui;
}

myHeaderGroupComponent.prototype.destroy = function () {

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

