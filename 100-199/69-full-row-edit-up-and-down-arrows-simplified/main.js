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
        suppressKeyboardEvent: params => {
            const key = params.event.key;
            const deltaY = key === 'ArrowUp' ? -1 : key === 'ArrowDown' ? + 1 : null;
            if (params.editing && deltaY) {
                params.api.setFocusedCell(params.node.rowIndex + deltaY, params.column);
                params.api.startEditingCell({
                    rowIndex: params.node.rowIndex + deltaY,
                    colKey: params.column
                });
                return true;
            }
            return false;
        }
    },
    editType: 'fullRow',
    rowData: null
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