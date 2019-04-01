var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    defaultColDef: {
        width: 150,
        editable: true,
    },
    // editType: 'fullRow',
    rowData: null,
};

function startEditingCell(deltaY) {
    const focusedCell = gridOptions.api.getFocusedCell();
    if (!focusedCell) {
        alert('Select a cell first');
        return;
    }
    // gridOptions.api.setFocusedCell(focusedCell.rowIndex + deltaY, focusedCell.column);
    gridOptions.api.startEditingCell({
        rowIndex: focusedCell.rowIndex + deltaY,
        colKey: focusedCell.column
    });
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