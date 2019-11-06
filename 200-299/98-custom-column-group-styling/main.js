var columnDefs = [
    {
        headerName: 'Athlete',
        field: 'athlete',
        filter: 'agTextColumnFilter',
    },
    {
        headerName: 'Age',
        field: 'age',
        filter: 'agNumberColumnFilter',
    },
    { headerName: 'Country', field: 'country' },
    {
        headerName: 'Sports Results',
        children: [
            { headerName: 'Sport', field: 'sport' },
            {
                headerName: 'Total',
                columnGroupShow: 'closed',
                field: 'total',

                filter: 'agNumberColumnFilter',
            },
            {
                headerName: 'Gold',
                columnGroupShow: 'open',
                field: 'gold',

                filter: 'agNumberColumnFilter',
            },
            {
                headerName: 'Silver',
                columnGroupShow: 'open',
                field: 'silver',

                filter: 'agNumberColumnFilter',
            },
            {
                headerName: 'Bronze',
                columnGroupShow: 'open',
                field: 'bronze',

                filter: 'agNumberColumnFilter',
            },
        ],
    },
];

var gridOptions = {
    defaultColDef: {
        sortable: true,
        resizable: true,
        filter: true,
    },
    debug: true,
    columnDefs: columnDefs,
    rowData: null,
    onGridReady: () => {
        let colIdsToAdjust = ['athlete', 'age', 'country'];

        colIdsToAdjust.forEach(id => {
            let headerEl = document.querySelector(`[col-id=${id}]`);
            headerEl.classList.add('custom-header');
        });

        params.api.sizeColumnsToFit();
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
