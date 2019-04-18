var columnDefs = [
    { headerName: 'Athlete', field: 'athlete' },
    { headerName: 'Country', field: 'country' },
    { headerName: 'Sport', field: 'sport' },
    { headerName: 'Age', field: 'age' },
    { headerName: 'Year', field: 'year' },
    { headerName: 'Date', field: 'date' },
    { headerName: 'Gold', field: 'gold' },
    { headerName: 'Silver', field: 'silver' },
    { headerName: 'Bronze', field: 'bronze' },
    { headerName: 'Total', field: 'total' },
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        width: 450,
        // pass the event to the editor before the grid panel captures it
        suppressKeyboardEvent: params => {
            if (params.editing && event.key === 'Tab') {
                let currentlyEditingCell = params.api.getCellEditorInstances({
                    rowNodes: [params.node],
                    column: params.column,
                })[0];
                currentlyEditingCell.processKeyboardEvent(event);
                return true;
            }
            return false;
        },
        editable: true,
        cellEditor: MyCellEditor,
    },
    enableRangeSelection: true,
    rowData: null,
};

function MyCellEditor() { }

MyCellEditor.prototype.init = function (params) {
    this.params = params;
    this.eInput = document.createElement('input');
    this.eInput.value = params.value;

    // this.eInput.addEventListener('keydown', event => {
    //     // has no effect as the grid panel has already captured the event
    //     event.stopPropagation();
    //     this.processKeyboardEvent(event);
    // });
};

MyCellEditor.prototype.getGui = function () {
    return this.eInput;
};

MyCellEditor.prototype.afterGuiAttached = function () {
    this.eInput.focus();
};

MyCellEditor.prototype.getValue = function () {
    return this.eInput.value;
};

MyCellEditor.prototype.processKeyboardEvent = function (event) {
    if (event.key === 'Tab') {
        this.params.api.setFocusedCell(
            this.params.rowIndex - 1,
            this.params.column
        );
        this.params.api.startEditingCell({
            rowIndex: this.params.rowIndex - 1,
            colKey: this.params.column,
        });
        this.params.api.clearRangeSelection();
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
