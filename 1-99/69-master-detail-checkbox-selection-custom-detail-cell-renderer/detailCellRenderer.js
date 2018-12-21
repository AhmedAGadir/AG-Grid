function DetailCellRenderer() { }

DetailCellRenderer.prototype.init = function (params) {
    this.masterGridApi = params.api;
    this.masterRowIndex = params.rowIndex;
    this.masterNode = params.node.parent;
    this.detailRowSelectedHandler = params.detailRowSelectedHandler;

    this.eGui = document.createElement('div');
    this.eGui.classList.add('full-width-panel');
    this.eGui.innerHTML = '<div class="full-width-grid"></div>';

    this.setupDetailGrid(params.data.callRecords, params.api, params.rowIndex);
};

DetailCellRenderer.prototype.getGui = function () {
    return this.eGui;
};

DetailCellRenderer.prototype.setupDetailGrid = function (callRecords, masterGridApi, masterRowIndex) {
    var eDetailGrid = this.eGui.querySelector('.full-width-grid');
    new agGrid.Grid(eDetailGrid, {
        columnDefs: [
            { field: 'callId', checkboxSelection: true },
            { field: 'direction' },
            { field: 'number' },
            { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" },
            { field: 'switchCode' }
        ],
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        // rowMultiSelectWithClick: true,
        onRowSelected: this.onRowSelected.bind(this),
        rowData: callRecords.slice(0, 3),
        onGridReady: function (params) {
            var detailGridId = "detail_" + masterRowIndex;
            var gridInfo = {
                id: detailGridId,
                api: params.api,
                columnApi: params.columnApi
            };

            masterGridApi.addDetailGridInfo(detailGridId, gridInfo);
            params.api.sizeColumnsToFit();
        },
    });
};

DetailCellRenderer.prototype.onRowSelected = function () {
    let store = [];
    var detailGridId = "detail_" + this.masterRowIndex;
    this.masterGridApi.getDetailGridInfo(detailGridId).api.forEachNode(node => store.push(node.selected));

    let selectionState;
    let filter = store.filter(bool => bool === true)
    if (filter.length === store.length) {
        selectionState = true
    } else if (filter.length === 0) {
        selectionState = false
    } else {
        selectionState = 'indeterminate'
    }

    this.detailRowSelectedHandler(this.masterNode, selectionState)
}

DetailCellRenderer.prototype.destroy = function () {
    var detailGridId = "detail_" + this.masterRowIndex;
    this.masterGridApi.getDetailGridInfo(detailGridId).api.destroy();
    this.masterGridApi.removeDetailGridInfo(detailGridId);
};