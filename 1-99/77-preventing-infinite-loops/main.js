var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Age', field: 'age', editable: true },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    onCellValueChanged: params => {
        if (params.node.updatingFromCellValueChanged) {
            return;
        }
        params.node.updatingFromCellValueChanged = true;
        params.node.setDataValue(params.column, getRandomAge());
        setTimeout(() => params.node.updatingFromCellValueChanged = false, 0);
    }
};

function getRandomAge() {
    return 18 + Math.floor(Math.random() * 15)
}

// setup the grid after the page has finished loading
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
