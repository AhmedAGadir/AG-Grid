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
                if (!focusedCell.current) {
                    return false;
                }
                return params.rowIndex === focusedCell.current.rowIndex
                    && params.colDef.field === focusedCell.current.column.colDef.field
            }
        }
    },
    rowData: null,
    onCellFocused: params => {
        // update focused cells
        focusedCell.previous = focusedCell.current;
        focusedCell.current = params.api.getFocusedCell();

        // refresh cells
        if (focusedCell.current) {
            params.api.refreshCells({
                rowNodes: [params.api.getRowNode(focusedCell.current.rowIndex)],
                columns: [focusedCell.current.column.colDef.field]
            })
        }
        if (focusedCell.previous) {
            params.api.refreshCells({
                rowNodes: [params.api.getRowNode(focusedCell.previous.rowIndex)],
                columns: [focusedCell.previous.column.colDef.field]
            })
        }
    }
};

const focusedCell = {
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
