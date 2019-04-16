var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true },
        { headerName: 'Sport', field: 'sport', enablePivot: true, pivot: true },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year', enableRowGroup: true, rowGroup: true },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Silver', field: 'silver', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Bronze', field: 'bronze', enableValue: true, aggFunc: 'sum' },
        { headerName: 'Total', field: 'total' }
    ],
    defaultColDef: {
        width: 150,
        headerComponent: 'myCustomHeader',
        // suppressMenu: true
    },
    autoGroupColumnDef: {
        width: 250
    },
    rowData: null,
    sideBar: true,
    // pivotMode: true,
    components: {
        myCustomHeader: MyCustomHeader
    },
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

function MyCustomHeader() {
}

MyCustomHeader.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = params.displayName;

    this.eGui.addEventListener('contextmenu', event => {
        event.preventDefault();
        // params.api.showColumnMenuAfterMouseClick(params.column.colId, event);
        params.showColumnMenu(this.eGui)
    });
};

MyCustomHeader.prototype.getGui = function () {
    return this.eGui;
};

MyCustomHeader.prototype.destroy = function () {
};
