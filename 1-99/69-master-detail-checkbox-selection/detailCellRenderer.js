function DetailCellRenderer() { }

DetailCellRenderer.prototype.init = function (params) {
  this.masterGridApi = params.api;
  this.masterRowIndex = params.rowIndex;
  this.masterNode = params.node.parent;

  this.eGui = document.createElement('div');
  this.eGui.classList.add('full-width-panel')
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
    onRowSelected: this.onRowSelectedHandler.bind(this),
    rowData: callRecords,
    onGridReady: function (params) {
      var detailGridId = "detail_" + masterRowIndex;
      var gridInfo = {
        id: detailGridId,
        api: params.api,
        columnApi: params.columnApi
      };

      console.log("adding detail grid info with id: ", detailGridId);
      masterGridApi.addDetailGridInfo(detailGridId, gridInfo);

      params.api.sizeColumnsToFit();
    },
  });
};

DetailCellRenderer.prototype.onRowSelectedHandler = function (params) {
  debugger;
}

DetailCellRenderer.prototype.destroy = function () {
  var detailGridId = "detail_" + this.masterRowIndex;

  console.log("destroying detail grid with id: ", detailGridId);
  this.masterGridApi.getDetailGridInfo(detailGridId).api.destroy();

  console.log("removing detail grid info with id: ", detailGridId);
  this.masterGridApi.removeDetailGridInfo(detailGridId);
};