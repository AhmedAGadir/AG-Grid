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
        width: 150,
        editable: true,
        cellEditor: 'myCellEditor'
    },
    rowData: null,
    components: {
        myCellEditor: MyCellEditor
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

function MyCellEditor() { }

MyCellEditor.prototype.init = function (params) {
    this.eSelect = document.createElement('div');
    this.eSelect.innerHTML = `
    <div ref="eValue" class="ag-rich-select-value">Dublin (Ireland)</div>
    <div ref="eList" class="ag-rich-select-list">
        <div class="ag-virtual-list-viewport">
        <div class="ag-virtual-list-container" style="height: 84px;">
            <div class="ag-virtual-list-item" style="top: 0px; line-height: 28px;">
                <div class="ag-rich-select-row ag-rich-select-row-selected">Dublin (Ireland)</div>
            </div>
            <div class="ag-virtual-list-item" style="top: 28px; line-height: 28px;">
                <div class="ag-rich-select-row">Cork (Ireland)</div>
            </div>
            <div class="ag-virtual-list-item" style="top: 56px; line-height: 28px;">
                <div class="ag-rich-select-row">Galway (Ireland)</div>
            </div>
        </div>
    </div>
        </div>`

    // this.eSelect.classList.add('ag-cell-edit-input');
    // this.eSelect.value = params.value;

    // this.eSelect.addEventListener('keydown', event => {
    //     switch (event.keyCode) {
    //         case 38: // key up  
    //             // params.api.stopEditing();
    //             // params.api.setFocusedCell(params.rowIndex - 1, params.column);
    //             params.api.startEditingCell({
    //                 rowIndex: params.rowIndex - 1,
    //                 colKey: params.column
    //             });
    //             break;
    //         case 40: // key down
    //             // params.api.stopEditing();
    //             // params.api.setFocusedCell(params.rowIndex + 1, params.column);
    //             params.api.startEditingCell({
    //                 rowIndex: params.rowIndex + 1,
    //                 colKey: params.column
    //             });
    //             break;
    //     }
    // })
};

MyCellEditor.prototype.getGui = function () {
    return this.eSelect;
};

MyCellEditor.prototype.focusIn = function () {
    this.eSelect.focus();
    this.eSelect.select();
}

MyCellEditor.prototype.getValue = function () {
    return this.eSelect.value;
};
