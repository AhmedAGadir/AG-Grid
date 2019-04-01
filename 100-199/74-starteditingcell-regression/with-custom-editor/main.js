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
        cellEditor: 'myCellEditor'
    },
    // editType: 'fullRow',
    rowData: null,
    components: {
        myCellEditor: MyCellEditor
    },
    onCellEditingStarted: params => {
        const { rowIndex, column } = params.api.getFocusedCell();
        const focusedCellEditorParams = {
            rowNodes: [params.api.getRowNode(rowIndex)],
            columns: [column]
        }
        const focusedCellEditor = params.api.getCellEditorInstances(focusedCellEditorParams)[0];
        focusedCellEditor.focusIn();
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

function startEditingCell(deltaY) {
    const focusedCell = gridOptions.api.getFocusedCell();
    if (!focusedCell) {
        alert('Select a cell first');
        return;
    }
    // comment api.setFocusedCell for testing
    // gridOptions.api.setFocusedCell(focusedCell.rowIndex + deltaY, focusedCell.column);
    gridOptions.api.startEditingCell({
        rowIndex: focusedCell.rowIndex + deltaY,
        colKey: focusedCell.column
    });
}

function MyCellEditor() { }

MyCellEditor.prototype.init = function (params) {
    this.eInput = document.createElement('input');
    this.eInput.classList.add('ag-cell-edit-input');
    this.eInput.value = params.value;
};

MyCellEditor.prototype.getGui = function () {
    return this.eInput;
};

MyCellEditor.prototype.focusIn = function () {
    this.eInput.focus();
    this.eInput.select();
}

MyCellEditor.prototype.getValue = function () {
    return this.eInput.value;
};
