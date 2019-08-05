function DetailCellRenderer() {
  this.masterGridApi = null;
  this.masterNodeId = null;
}

DetailCellRenderer.prototype.init = function (params) {
  // trick to convert string of HTML into DOM object
  var eTemp = document.createElement('div');
  eTemp.innerHTML = this.getTemplate(params.data);
  this.eGui = eTemp.firstElementChild;

  this.masterGridApi = params.api;
  this.masterNodeId = params.data.account;

  this.setupDetailGrid(params.data, params.api, this.masterNodeId);
};

DetailCellRenderer.prototype.setupDetailGrid = function (data, masterGridApi, masterNodeId) {
  var detailGridDivs = this.eGui.querySelectorAll('[class^="full-width-grid"]');
  var eDetailGrid1 = detailGridDivs[0];
  new agGrid.Grid(eDetailGrid1, {
    columnDefs: [
      { field: 'callId' },
      { field: 'direction' },
      { field: 'number' },
      { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" },
      { field: 'switchCode' }
    ],
    rowData: data.callRecords,
    onGridReady: function (params) {
      // better to use master node id's instead of index's for the detailGrid id's, 
      // as the master node's row index can change depending on how many detail grids are currently being shown
      var detailGridId = "detail1_" + masterNodeId;

      var gridInfo = {
        id: detailGridId,
        api: params.api,
        columnApi: params.columnApi
      };

      console.log("adding detail grid info with id: ", detailGridId);
      masterGridApi.addDetailGridInfo(detailGridId, gridInfo);
    }
  });

  var eDetailGrid2 = detailGridDivs[1];
  new agGrid.Grid(eDetailGrid2, {
    columnDefs: [
      { field: 'textId' },
      { field: 'direction' },
      { field: 'number' },
      { field: 'duration', valueFormatter: "x.toLocaleString() + 's'" },
      { field: 'switchCode' }
    ],
    rowData: data.textRecords,
    onGridReady: function (params) {
      var detailGridId = "detail2_" + masterNodeId;
      // it would be better to use master node id's instead of index's for the detailGrid id's, 
      // as the master node's row index can change depending on how many detail grids are currently being shown

      var gridInfo = {
        id: detailGridId,
        api: params.api,
        columnApi: params.columnApi
      };

      console.log("adding detail grid info with id: ", detailGridId);
      masterGridApi.addDetailGridInfo(detailGridId, gridInfo);
    }
  });
};

DetailCellRenderer.prototype.getTemplate = function (data) {
  var template =
    `<div class="full-width-panel">
      Call Records
      <div class="full-width-grid-1"></div> 
      Text Records
      <div class="full-width-grid-2"></div> 
    </div>`;

  return template;
};

DetailCellRenderer.prototype.getGui = function () {
  return this.eGui;
};

DetailCellRenderer.prototype.destroy = function () {
  var detailGrid1Id = "detail1_" + this.masterNodeId;
  var detailGrid2Id = "detail2_" + this.masterNodeId;

  console.log("destroying detail grid with id: ", detailGrid1Id, detailGrid2Id);
  this.masterGridApi.getDetailGridInfo(detailGrid1Id).api.destroy();
  this.masterGridApi.getDetailGridInfo(detailGrid2Id).api.destroy();

  console.log("removing detail grid info with id: ", detailGrid1Id);
  console.log("removing detail grid info with id: ", detailGrid2Id);
  this.masterGridApi.removeDetailGridInfo(detailGrid1Id);
  this.masterGridApi.removeDetailGridInfo(detailGrid2Id);
};