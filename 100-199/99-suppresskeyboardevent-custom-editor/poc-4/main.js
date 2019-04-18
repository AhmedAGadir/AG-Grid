var columnDefs = [
    {
        headerName: 'value',
        field: 'value',
        width: 450,
        suppressKeyboardEvent: params => {
            if (params.editing && params.event.key === 'Enter' || params.editing && event.key === 'Tab') {
                return true
            }
            return false;
        },
        editable: true,
        cellEditor: MyCellEditor,
    },
];

var gridOptions = {
    columnDefs: columnDefs,
    enableRangeSelection: true,
    rowData: [{ value: 1 }, { value: 2 }],
};


function MyCellEditor() { }

MyCellEditor.prototype.init = function (params) {
    this.eInput = document.createElement('input');
    this.eInput.value = params.value;

    this.eInput.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === 'Tab') {
            // has no effect as the grid has already captured the event
            event.stopPropagation();
        }
    });
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

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
