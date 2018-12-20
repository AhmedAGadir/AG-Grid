var columnDefs = [
    // group cell renderer needed for expand / collapse icons
    {
        field: 'name',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            checkbox: true,
        },
    },
    { field: 'account' },
    { field: 'calls' },
    { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
];

var gridOptions = {
    rowSelection: 'multiple',
    columnDefs: columnDefs,
    masterDetail: true,
    onRowSelected: masterRowSelectedHandler,
    detailCellRendererParams: (params) => {
        let masterRowIndex = params.index;
        return {
            detailGridOptions: {
                columnDefs: [
                    { field: 'callId', checkboxSelection: true },
                    { field: 'direction' },
                    { field: 'number' },
                    {
                        field: 'duration',
                        valueFormatter: "x.toLocaleString() + 's'",
                    },
                    { field: 'switchCode' },
                ],
                rowSelection: 'multiple',
                onRowSelected: detailRowSelectedHandler,
                onGridReady: function (params) {
                    var detailGridId = "detail_" + masterRowIndex;
                    var gridInfo = {
                        id: detailGridId,
                        api: params.api,
                        columnApi: params.columnApi
                    };
                    params.api.addDetailGridInfo(detailGridId, gridInfo);
                    params.api.sizeColumnsToFit();
                },
            },
            getDetailRowData: function (params) {
                params.successCallback(params.data.callRecords);
            },
        }
    },
    detailRowHeight: 340,
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();

        // arbitrarily expand a row for presentational purposes
        setTimeout(function () {
            var rowCount = 0;
            params.api.forEachNode(function (node) {
                node.setExpanded(rowCount++ === 1);
            });
        }, 500);
    },
};

function masterRowSelectedHandler(params) {
    var isSelected = params.node.selected;
    params.node.detailNode.detailGridInfo.api.forEachNode(node => node.setSelected(isSelected))
}

function detailRowSelectedHandler(params) {
    // couldnt find a way to reach the parent node from here
    debugger;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/cell-editing/data/data.json',
        })
        .then(function (data) {
            gridOptions.api.setRowData(data);
        });
});
