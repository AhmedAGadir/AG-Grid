const ENTER_KEYCODE = 13;

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
        width: 250,
        editable: true,
        cellEditor: 'multilineCellEditor',
        suppressKeyboardEvent: params => {
            if (params.event.keyCode === ENTER_KEYCODE && params.editing) {
                let currentlyEditingCell = params.api.getCellEditorInstances({
                    rowNodes: [params.node],
                    column: params.column,
                })[0];
                currentlyEditingCell.processEnter(event);
                return true;
            }
            // another if statement where if ctrl + enter a pressed then editing is stopped
            return false;
        }
    },
    rowData: null,
    rowHeight: 60,
    components: {
        multilineCellEditor: MultilineCellEditor
    },
    onCellEditingStarted: params => {
        const { rowIndex, column } = params.api.getEditingCells()[0];
        const focusedCellEditorParams = {
            rowNodes: [params.api.getRowNode(rowIndex)],
            columns: [column]
        };
        const focusedCellEditor = params.api.getCellEditorInstances(focusedCellEditorParams)[0];
        focusedCellEditor.focusIn();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url: 'olympicWinners.json'
        })
        .then(function (data) {
            data = data.map(row => {
                let fields = Object.keys(row);
                let newRow = {};
                fields.forEach(field => newRow[field] = row[field].replace(/<br\/>/g, '\r\n'));
                return newRow;
            });
            gridOptions.api.setRowData(data);
        });
});

function MultilineCellEditor() { }

MultilineCellEditor.prototype.init = function (params) {
    this.value = params.value;
    this.eGui = document.createElement('textarea');
    this.eGui.addEventListener('input', event => {
        this.value = event.target.value;
    });
    this.eGui.innerHTML = params.value;

}

MultilineCellEditor.prototype.getGui = function () {
    return this.eGui;
}

MultilineCellEditor.prototype.getValue = function () {
    console.log('getValue')
    console.log(this.value)
    return this.value;
}

MultilineCellEditor.prototype.focusIn = function () {
    this.eGui.focus();
}

MultilineCellEditor.prototype.processEnter = function (event) {
    // have to find caret position here and then add a new line wherever it is
    this.eGui.focus();

}