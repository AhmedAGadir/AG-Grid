var columnDefs = [
    // group cell renderer needed for expand / collapse icons
    {
        field: 'selectionState',
        onCellValueChanged: updateSelection
    },
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
    // suppressRowClickSelection: true,
    rowMultiSelectWithClick: true,
    masterDetail: true,
    onRowClicked: masterRowSelectedHandler,
    detailRowHeight: 260,
    detailCellRenderer: 'myDetailCellRenderer',
    detailCellRendererParams: {
        detailRowSelectedHandler: detailRowSelectedHandler
    },
    components: {
        agGroupCellRenderer: () => 'yo',
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
    params.node.setDataValue('selectionState', params.node.selected);
}

function detailRowSelectedHandler(node, selectionState) {
    node.setDataValue('selectionState', selectionState)
}

function updateSelection(params) {
    if (params.newValue !== params.oldValue) {

        let detailGridId = 'detail_' + (params.node.rowIndex + 1);

        switch (params.newValue) {
            case true:
                params.api.getDetailGridInfo(detailGridId).api.forEachNode(node => node.setSelected(true));
                params.node.setSelected(true);
                break;
            case false:
                params.api.getDetailGridInfo(detailGridId).api.forEachNode(node => node.setSelected(false));
                params.node.setSelected(false);
                break;
            case 'indeterminate':
                params.node.setSelected(false);
                break;
        }
    }

    // ** much simpler to acess detail nodes if not using a custom detailCellRenderer **
    // params.node.detailNode.detailGridInfo.api.forEachNode(...))
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
