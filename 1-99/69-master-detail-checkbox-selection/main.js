var columnDefs = [
    // group cell renderer needed for expand / collapse icons
    {
        field: 'name',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            checkbox: true
        }
    },
    { field: 'account' },
    { field: 'calls' },
    { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowSelection: 'multiple',
    masterDetail: true,
    onRowSelected: masterRowSelectedHandler,
    detailRowHeight: 260,
    detailCellRenderer: 'myDetailCellRenderer',
    // detailCellRendererParams: {
    //     detailRowSelectedHandler: detailRowSelectedHandler
    // },
    components: {
        myDetailCellRenderer: DetailCellRenderer,
    },
    onGridReady: function (params) {
        // arbitrarily expand a row for presentational purposes
        setTimeout(function () {
            var rowCount = 0;
            params.api.forEachNode(function (node) {
                node.setExpanded(rowCount++ === 1);
            });
        }, 500);
    },
    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    },
};

function masterRowSelectedHandler(params) {
    let detailGridId = 'detail_' + (params.rowIndex + 1);

    params.api.getDetailGridInfo(detailGridId).api.forEachNode(node => node.setSelected(params.node.selected))

    // ** much simpler to acess detail nodes if not using a custom detailCellRenderer **
    // var isSelected = params.node.selected;
    // params.node.detailNode.detailGridInfo.api.forEachNode(node => node.setSelected(isSelected))
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/custom-detail-with-grid/data/data.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        });
});
