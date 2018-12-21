var columnDefs = [
    // group cell renderer needed for expand / collapse icons
    {
        field: 'name',
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            checkbox: true
        }
    },
    // {
    //     field: 'selectionState',
    //     cellStyle: { backgroundColor: 'lightblue' },
    //     onCellValueChanged: updateSelection,
    // },
    { field: 'account' },
    { field: 'calls' },
    { field: 'minutes', valueFormatter: "x.toLocaleString() + 'm'" },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowSelection: 'multiple',
    // suppressRowClickSelection: true,
    rowMultiSelectWithClick: true,
    masterDetail: true,
    // onRowSelected: masterRowSelectedHandler,
    detailRowHeight: 134,
    detailCellRenderer: 'myDetailCellRenderer',
    detailCellRendererParams: (params) => ({
        detailRowSelectedHandler: onDetailRowsSelectionChanged,
        initialIds: params.node.data.childIdsSelected || []
    }),
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
    onRowSelected: (params) => {
        if (params.node.data.updatingFromDetails) return;
        onParentNodeSeleted(params.node)
    }
};

function onDetailRowsSelectionChanged(node, parentSelectionState, idsSelected) {
    console.log(idsSelected);
    node.data.childIdsSelected = idsSelected;
    node.data.updatingFromDetails = true;
    node.selectThisNode(parentSelectionState);
    setTimeout(() => node.data.updatingFromDetails = false, 0);
}

function onParentNodeSeleted(node) {
    let detailGridId = 'detail_' + (node.rowIndex + 1);
    gridOptions.api.getDetailGridInfo(detailGridId).api.forEachNode(detailNode => detailNode.setSelected(node.selected));
}


document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid-docs/latest/src/javascript-grid-master-detail/custom-detail-with-grid/data/data.json',
        })
        .then(function (data) {
            data = data.map(d => {
                d.selectionState = false;
                return d;
            })
            gridOptions.api.setRowData(data);
        });
});
