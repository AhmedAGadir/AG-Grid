var columnDefs = [
    {field: "gold", width: 100},
    {field: "silver", width: 100},
    {field: "bronze", width: 100},
    {field: "total", width: 100}
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        editable: true,
        cellRenderer: params => params.value.current,
        cellEditor: 'myCellEditor',
        cellClassRules: {
            'rag-blue': 'x.previous && x.previous % 2 !== 0',
            'rag-green': 'x.previous && x.previous % 2 === 0'
        }
    },
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
    },
    onCellValueChanged: params => {
        console.log('onCellValueChanged', params.newValue);
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            let rowData = httpResult.map(row => {
                let updatedRow = {}
                Object.keys(row).map(field => {
                    updatedRow[field] = {
                        previous: null,
                        current: row[field]
                    };
                });
                return updatedRow;
            })
            gridOptions.api.setRowData(rowData);
        }
    };
});

function MyCellEditor() { }

MyCellEditor.prototype.init = function (params) {
    this.params = params;
    this.eInput = document.createElement('input');
    this.eInput.classList.add('ag-cell-edit-input');
    this.eInput.value = params.value.current;
};

MyCellEditor.prototype.getGui = function () {
    return this.eInput;
};

MyCellEditor.prototype.focusIn = function () {
    this.eInput.focus();
    this.eInput.select();
}

MyCellEditor.prototype.getValue = function () {
    return {
        previous: this.params.value.current,
        current: Number(this.eInput.value)
    };
};
