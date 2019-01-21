var currentlyEditing = false;

var columnDefs = [
    { headerName: 'Athlete', field: 'athlete', editable: true },
    { headerName: 'Sport', field: 'sport', editable: true },
    {
        headerName: '',
        field: 'delete',
        cellRenderer: DeleteRowRenderer,
        hide: true
    }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    onCellEditingStarted: params => {
        // console.log('onCellEditingStarted', currentlyEditing);
        const editingCell = params.api.getEditingCells()[0];
        params.columnApi.setColumnVisible('delete', true);
        params.api.startEditingCell({
            rowIndex: editingCell.rowIndex,
            colKey: editingCell.column.colId
        });
        setTimeout(() => currentlyEditing = true, 0);
    },
    onCellEditingStopped: params => {
        // console.log('onCellEditingStopped', currentlyEditing);
        if (currentlyEditing) {
            params.columnApi.setColumnVisible('delete', false);
            setTimeout(() => currentlyEditing = false, 0);
        }
    },
    // onColumnVisible: params => {
    //     console.log('onColumnVisible', currentlyEditing);
    // }
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
            data = data.reverse().slice(0, 3); // random data
            gridOptions.api.setRowData(data);
        });
});

function DeleteRowRenderer() { }

DeleteRowRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    var button = document.createElement('button');
    button.textContent = 'Delete Row';
    button.addEventListener('click', () => {
        gridOptions.api.updateRowData({ remove: [params.data] })
    })
    this.eGui.appendChild(button);
}

DeleteRowRenderer.prototype.getGui = function () {
    return this.eGui;
}