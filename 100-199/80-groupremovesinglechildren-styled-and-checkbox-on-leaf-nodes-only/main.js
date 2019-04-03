var gridOptions = {
    columnDefs: [
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true, hide: true },
        { headerName: 'Sport', field: 'sport', enableRowGroup: true, rowGroup: true, hide: true },
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
        cellClass: params => {
            if (params.node.parent && params.node.parent.allChildrenCount === 1) {
                return 'foo'
            }
        }
    },
    autoGroupColumnDef: {
        field: 'athlete',
        minWidth: 300,
        // checkboxSelection: params => !params.node.group,
        cellRendererParams: {
            checkbox: params => !params.node.group
        }
    },
    rowData: null,
    rowSelection: 'multiple',
    onFirstDataRendered: params => params.api.sizeColumnsToFit(),
    groupRemoveSingleChildren: true

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
