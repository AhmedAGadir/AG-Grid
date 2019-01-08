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
    editType: 'fullRow',
    rowData: null,
    onRowEditingStarted: params => {
        params.api.getEditingCells().forEach(editingCell => {
            let input = document.querySelector(`div[row-index="${editingCell.rowIndex}"] div[col-id="${editingCell.column.colId}"] input`);
            input.addEventListener('keydown', event => {
                switch (event.keyCode) {
                    case 38: // key up  
                        params.api.setFocusedCell(editingCell.rowIndex - 1, editingCell.column);
                        // not using .startEditingCell as it makes for a worse user experience, 
                        // when the cell starts editing you have to select all and then type to replace text
                        // as opposed to the default behaviour of just typing to replace text 
                        // params.api.startEditingCell({
                        //     rowIndex: editingCell.rowIndex - 1,
                        //     colKey: editingCell.column,
                        // })
                        break;
                    case 40: // key down
                        params.api.setFocusedCell(editingCell.rowIndex + 1, editingCell.column);
                        // params.api.startEditingCell({
                        //     rowIndex: editingCell.rowIndex + 1,
                        //     colKey: editingCell.column,
                        // })
                        break;
                }
            })
        })
    }
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