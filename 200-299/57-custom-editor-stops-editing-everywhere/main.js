var columnDefs = [
    { headerName: "Athlete", field: "athlete", width: 150 },
    { headerName: "Age", field: "age", width: 90, filter: 'agNumberColumnFilter' },
    { headerName: "Country", field: "country", width: 120 },
    { headerName: "Year", field: "year", width: 90 },
    {
        headerName: "Date", field: "date", width: 190, filter: 'agDateColumnFilter', filterParams: {
            comparator: function (filterLocalDateAtMidnight, cellValue) {
                var dateAsString = cellValue;
                var dateParts = dateAsString.split("/");
                var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));

                if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                    return 0;
                }

                if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                }

                if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                }
            }
        }
    },
    { headerName: "Sport", field: "sport", width: 110 },
    { headerName: "Gold", field: "gold", width: 100, filter: 'agNumberColumnFilter' },
    { headerName: "Silver", field: "silver", width: 100, filter: 'agNumberColumnFilter' },
    { headerName: "Bronze", field: "bronze", width: 100, filter: 'agNumberColumnFilter' },
    { headerName: "Total", field: "total", width: 100, filter: false }
];

var gridOptions = {
    defaultColDef: {
        filter: true,
        editable: true,
        cellEditor: 'myCellEditor',
    },
    onCellValueChanged: params => console.log('onCellValueChanged', params),
    // stopEditingWhenGridLosesFocus: true,
    floatingFilter: true,
    columnDefs: columnDefs,
    rowData: null,
    // Here is where we specify the component to be used as the date picker widget
    components: {
        agDateInput: CustomDateComponent,
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

};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // do http request to get our sample data - not using any framework to keep the example self contained.
    // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json');
    httpRequest.send();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            var httpResult = JSON.parse(httpRequest.responseText);
            gridOptions.api.setRowData(httpResult);
        }
    };
});

function MyCellEditor() { }

MyCellEditor.prototype.init = function (params) {
    this.eInput = document.createElement('input');
    this.eInput.classList.add('ag-cell-edit-input');
    this.eInput.value = params.value;

    this.eInput.addEventListener('blur', event => {
        console.log('blur', event);
        params.api.stopEditing();
    })
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
