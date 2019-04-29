var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete', pinned: 'left' },
        {
            checkboxSelection: true,
            // field: "checkbox",
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            // headerName: "",
            pinned: "left",
            width: 50
        },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze', pinned: 'right' },
    ],
    defaultColDef: {
        width: 150,
        suppressKeyboardEvent: params => {
            // ctrl + c || cmd + c
            if (params.event.keyCode == 67 && (params.event.ctrlKey || params.event.metaKey)) {
                let value = params.data[params.column.colId];
                // or any other way you'd like to copy 
                params.api.clipboardService.copyDataToClipboard(value);
                return true;
            }
            return false
        }
    },
    rowData: null,
    enableRangeSelection: true,
    rowSelection: 'single',
    onGridReady: params => {
        params.api.sizeColumnsToFit();
    },
    getContextMenuItems: params => {
        return [
            {
                // custom item
                name: 'Copy (Custom)',
                action: function () {
                    params.api.clipboardService.copyDataToClipboard(params.value);
                }
            },
            'separator', 'paste', 'export'
        ];

    }

}

// setup the grid after the page has finished loading
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
