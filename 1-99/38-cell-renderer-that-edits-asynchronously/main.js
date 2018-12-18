let outputMessage = document.getElementById('outputMessage');

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
        cellRenderer: 'editorCellRenderer',
    },
    components: {
        editorCellRenderer: EditorCellRenderer,
    },
    rowData: null,
};

function EditorCellRenderer() {}

EditorCellRenderer.prototype.init = function(params) {
    this.params = params;
    this.eGui = document.createElement('input');
    this.eGui.disabled = true;
    this.eGui.value = this.params.value;
    this.eGui.classList.add('removeDefault');

    this.params.api.addEventListener('cellDoubleClicked', params => {
        // return if not on current cell
        if (
            params.node !== this.params.node ||
            params.value !== this.params.value
        ) {
            return;
        }
        // mimicking asynchronous call
        outputMessage.textContent = 'mimicking asynchronous call...'
        setTimeout(() => {
            if (params.node.rowIndex % 2 == 0) {
                outputMessage.textContent = 'no editing allowed on even rows';
                return;
            } else {
                outputMessage.textContent = 'editing allowed on odd rows';
                this.eGui.disabled = false;
                this.eGui.select();
            }
        }, 1000);
    });

    this.eGui.addEventListener('blur', () => {
        this.params.node.setDataValue(this.params.colDef.field, this.eGui.value)
    })
};

EditorCellRenderer.prototype.getGui = function() {
    return this.eGui;
};

document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function(data) {
            gridOptions.api.setRowData(data);
        });
});
