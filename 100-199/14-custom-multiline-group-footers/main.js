// whenever filtering, sorting, or grouping happens - remove all metarows, [filter|sort]?, add new metarows 

var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Country', field: 'country', rowGroup: true },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year', rowGroup: true },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    defaultColDef: {
        width: 150,
    },
    rowData: null,
    onFirstDataRendered: params => {

        const rowGroups = {};

        gridOptions.columnApi.getRowGroupColumns().forEach(col => {
            rowGroups[col.colId] = new Set();
        });

        gridOptions.api.forEachNode(node => {
            // if (node.group) {
            //     rowGroups[node.field].add(node.key)
            // }
            if (node.group) return;
            for (let key of Object.keys(rowGroups)) {
                rowGroups[key].add(node.data[key])
            }
        });

        let rowsToAdd = [];

        console.log(rowGroups)

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
