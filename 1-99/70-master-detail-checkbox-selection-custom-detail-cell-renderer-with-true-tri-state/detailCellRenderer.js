function DetailCellRenderer() { }

DetailCellRenderer.prototype.init = function (params) {
    console.log('reinstate selection on:', params.initialIds);
    this.initialIds = params.initialIds;
    this.masterGridApi = params.api;
    this.masterRowIndex = params.rowIndex;
    this.masterNode = params.node.parent;
    this.detailRowSelectedHandler = params.detailRowSelectedHandler;

    this.eGui = document.createElement('div');
    this.eGui.classList.add('full-width-panel');
    this.eGui.innerHTML = '<div class="full-width-grid"></div>';
    this.masterRowData = params.data;

    this.setupDetailGrid(params.data.callRecords, params.api, params.rowIndex);
};

DetailCellRenderer.prototype.getGui = function () {
    return this.eGui;
};

DetailCellRenderer.prototype.setupDetailGrid = function (callRecords, masterGridApi, masterRowIndex) {
    var eDetailGrid = this.eGui.querySelector('.full-width-grid');
    this.data = callRecords.slice(0, 3);
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
        rowData: this.data,
        onGridReady: (params) => {
            var detailGridId = "detail_" + masterRowIndex;
            var gridInfo = {
                id: detailGridId,
                api: params.api,
                columnApi: params.columnApi
            };

            this.detailApi = params.api;
            masterGridApi.addDetailGridInfo(detailGridId, gridInfo);
            params.api.sizeColumnsToFit();
            this.initialIds.forEach(id => this.detailApi.getRowNode(id).setSelected(true));

        },
    });
};

DetailCellRenderer.prototype.onRowSelected = function (params) {
    debugger;
    let selectedNodes = this.detailApi.getSelectedNodes();
    if (this.data.length === selectedNodes.length) {
        selectionState = true
    } else if (selectedNodes.length === 0) {
        selectionState = false
    } else {
        selectionState = undefined
    }

    this.detailRowSelectedHandler(this.masterNode, selectionState, selectedNodes.map(node => node.id))
}

DetailCellRenderer.prototype.destroy = function () {
    var detailGridId = "detail_" + this.masterRowIndex;
    this.masterGridApi.getDetailGridInfo(detailGridId).api.destroy();
    this.masterGridApi.removeDetailGridInfo(detailGridId);
};