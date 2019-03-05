var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
        { headerName: 'Total', field: 'total' }
    ],
    defaultColDef: {
        width: 150,
        cellClassRules: {
            'focused': params => {
                if (!focusedCells.current) {
                    return false;
                }
                return params.rowIndex === focusedCells.current.rowIndex
                    && params.colDef.field === focusedCells.current.column.colDef.field
            }
        }
    },
    rowData: null,
    onCellFocused: params => {
        // update focused cells
        focusedCells.previous = focusedCells.current;
        focusedCells.current = params.api.getFocusedCell();

        // refresh cells
        if (focusedCells.current) {
            params.api.refreshCells({
                rowNodes: [params.api.getRowNode(focusedCells.current.rowIndex)],
                columns: [focusedCells.current.column.colDef.field]
            })
        }
        if (focusedCells.previous) {
            params.api.refreshCells({
                rowNodes: [params.api.getRowNode(focusedCells.previous.rowIndex)],
                columns: [focusedCells.previous.column.colDef.field]
            })
        }
    }
};

const focusedCells = {
    current: null,
    previous: null
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
