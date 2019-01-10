var gridOptions = {
    // define grid columns
    columnDefs: [
        // using default ColDef
        {
            headerName: 'Athlete',
            field: 'athlete',
            hide: false,
            enableRowGroup: false,
            enablePivot: true,
        },
        {
            headerName: 'Country',
            field: 'country',
            hide: false,
            enableRowGroup: false,
            enablePivot: true,
        },

        {
            headerName: 'Age',
            field: 'age',
            hide: false,
            enableRowGroup: false,
            enablePivot: true,
        },
    ],

    onGridReady: () => {
        console.clear();
        let printColumnDefsBtn = document.querySelector('#printColumnDefsBtn');
        let changeColumnDefsBtn = document.querySelector(
            '#changeColumnDefsBtn'
        );
        changeColumnDefsBtn.addEventListener('click', () => {
            gridOptions.api.setColumnDefs([
                {
                    headerName: 'CHANGED COUNTRY',
                    field: 'country',
                    hide: false,
                    enableRowGroup: false,
                    enablePivot: true,
                },
                {
                    headerName: 'CHANGED ATHLETE',
                    field: 'athlete',
                    hide: false,
                    enableRowGroup: false,
                    enablePivot: true,
                },

                {
                    headerName: 'Changed Age',
                    field: 'age',
                    hide: false,
                    enableRowGroup: false,
                    enablePivot: true,
                },
            ]);
        });

        printColumnDefsBtn.addEventListener('click', () => {
            console.log(getColumnDefs());
        });
    },
};

// setup the grid after the page has finished loading
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

function getColumnDefs() {
    let columns = gridOptions.columnApi.getAllColumns();
    return columns.map(column => column.colDef);
}
