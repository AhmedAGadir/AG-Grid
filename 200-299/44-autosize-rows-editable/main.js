var rowData = [
    {
        athlete: "Michael Phelps",
        age: 'Lorem ipsum dolor sit amet',
        country: "United States",
        year: 2012,
        date: "12/08/2012",
        sport: "Swimming",
    },
    {
        athlete: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        age: 25,
        country: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, atque.",
        year: 2008,
        date: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        sport: "Swimming",
    },
    {
        athlete: "Aleksey Nemov",
        age: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, atque. Accusantium numquam, commodi minus laborum repellat hic harum quis, delectus illo excepturi ad magnam provident temporibus laboriosam, corporis quia? Non.',
        country: "Russia",
        year: 2000,
        date: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, atque. Accusantium numquam,",
        sport: "Gymnastics",
    },
    {
        athlete: "Alicia Coutts",
        age: 24,
        country: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        year: 2012,
        date: "12/08/2012",
        sport: "Swimming",
    },
    {
        athlete: "Missy Franklin",
        age: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, atque. Accusantium numquam, commodi minus laborum repellat hic harum quis, delectus illo excepturi ad magnam provident temporibus laboriosam, corporis quia? Non.',
        country: "United States",
        year: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, atque. Accusantium numquam, commodi minus laborum repellat hic harum quis, delectus illo excepturi ad magnam provident temporibus laboriosam, corporis quia? Non. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, atque. Accusantium numquam, commodi minus laborum repellat hic harum quis, delectus illo excepturi ad magnam provident temporibus laboriosam, corporis quia? Non.',
        date: "12/08/2012",
        sport: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, atque. Accusantium numquam, commodi minus laborum repellat hic harum quis, delectus illo excepturi ad magnam provident temporibus laboriosam, corporis quia? Non.",
    },
]

var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Country', field: 'country' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Sport', field: 'sport' },
    ],
    defaultColDef: {
        width: 150,
        editable: true,
        cellRenderer: 'myCellRenderer',
        cellEditor: 'multilineCellEditor',
    },
    rowData: rowData,
    components: {
        myCellRenderer: MyCellRenderer,
        multilineCellEditor: MultilineCellEditor
    },
    domLayout: 'autoHeight',
    onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
        params.api.forEachNode(node => {
            params.api.getCellRendererInstances({ rowNodes: [node] })[0].updateRowHeight();
        });
    },
    onCellEditingStarted: params => {
        const { rowIndex, column } = params.api.getEditingCells()[0];
        const focusedCellEditorParams = {
            rowNodes: [params.api.getRowNode(rowIndex)],
            columns: [column]
        };
        const focusedCellEditor = params.api.getCellEditorInstances(focusedCellEditorParams)[0];
        focusedCellEditor.focusIn();
    },
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

function MyCellRenderer() { }

MyCellRenderer.prototype.init = function (params) {
    this.params = params;
    this.eGui = document.createElement('div');
    this.eGui.textContent = params.value;
}

MyCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

MyCellRenderer.prototype.refresh = function (params) {
    this.eGui.textContent = params.value;
    this.updateRowHeight();
    return true;
}

MyCellRenderer.prototype.updateRowHeight = function () {
    let cellRenderers = this.params.api.getCellRendererInstances({ rowNodes: [this.params.node] });
    let maxHeight = cellRenderers.reduce((maxHeight, renderer) => {
        let rendererHeight = renderer.eGui.offsetHeight;
        if (rendererHeight > maxHeight) {
            maxHeight = renderer.eGui.offsetHeight
        }
        return maxHeight;

    }, 0);
    const offset = 3;
    this.params.node.setRowHeight(maxHeight + offset);
    this.params.api.onRowHeightChanged();
}


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
    return this.value;
}

MultilineCellEditor.prototype.focusIn = function () {
    this.eGui.focus();
}