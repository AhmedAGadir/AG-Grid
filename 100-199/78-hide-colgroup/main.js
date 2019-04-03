var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age', filter: 'agNumberColumnFilter' },
        { headerName: 'Year', field: 'year', filter: 'agNumberColumnFilter' },
        { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter' },
        {
            headerName: 'Medals',
            groupId: 'medalsGroup',
            children: [
                { headerName: 'Gold', field: 'gold', filter: 'agDateColumnFilter' },
                { headerName: 'Silver', field: 'silver', filter: 'agDateColumnFilter' },
                { headerName: 'Bronze', field: 'bronze', filter: 'agDateColumnFilter' }
            ]
        }
    ],
    defaultColDef: {
        width: 150,
        editable: true,
        filter: 'agTextColumnFilter'
    },
    defaultColGroupDef: {
        marryChildren: true
    },
    rowData: null,
    onGridReady: params => params.api.sizeColumnsToFit()
};

function hideMedalsColumnGroup() {
    var medalsColGroup = gridOptions.columnApi.getColumnGroup('medalsGroup')
    gridOptions.columnApi.setColumnsVisible(medalsColGroup.children, false);
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json' }).then(function (data) {
        gridOptions.api.setRowData(data);
    });
});