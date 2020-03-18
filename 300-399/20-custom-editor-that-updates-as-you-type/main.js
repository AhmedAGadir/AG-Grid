var gridOptions = {
    columnDefs: [
        { field: 'num1', cellEditor: 'mySimpleCellEditor' },
        { field: 'num2', cellEditor: 'mySimpleCellEditor' },
        {
            field: 'total',
            editable: false,
            valueGetter: params => params.data.num1 + params.data.num2
        },
    ],
    rowData: [
        { num1 : 1, num2: 2},
        { num1 : 1, num2: 2},
        { num1 : 1, num2: 2}
    ],
    defaultColDef: {
        editable: true,
        flex: 1,
        minWidth: 100,
    },
    components: {
        mySimpleCellEditor: MySimpleCellEditor,
    },
};

var KEY_BACKSPACE = 8;
var KEY_F2 = 113;
var KEY_DELETE = 46;

function MySimpleCellEditor() {}

MySimpleCellEditor.prototype.init = function(params) {
    this.params = params;
    this.eInput = document.createElement('input');
    this.eInput.classList.add('my-simple-editor');

    this.eInput.addEventListener('input', this.inputHandler.bind(this));

};

MySimpleCellEditor.prototype.inputHandler = function(e) {
    this.params.node.setDataValue(this.params.column.colId, e.target.value);
}

MySimpleCellEditor.prototype.getGui = function() {
    return this.eInput;
};

MySimpleCellEditor.prototype.getValue = function() {
    return this.eInput.value;
};

MySimpleCellEditor.prototype.afterGuiAttached = function() {
    this.eInput.focus();
    this.eInput.select();
    this.eInput.value = this.params.value;
};


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
