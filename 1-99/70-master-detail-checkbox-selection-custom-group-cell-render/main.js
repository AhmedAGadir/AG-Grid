var columnDefs = [
    {
        field: 'name',
        cellRenderer: 'customGroupRenderer',
        cellRendererParams: {
            // onCheckboxClicked: checkboxClickedHandler
        }
    },
    { field: 'account' },
    { field: 'calls' },
    { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    // rowMultiSelectWithClick: true,
    // onRowSelected: masterRowSelectedHandler,
    masterDetail: true,
    detailRowHeight: 260,
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
                // onRowSelected: detailRowSelectedHandler,
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
    components: {
        customGroupRenderer: CustomGroupRenderer,
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
