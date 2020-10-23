function getDetailCellRenderer() {
  function DetailCellRenderer() {}

  DetailCellRenderer.prototype.init = function (params) {
    this.params = params;

    // trick to convert string of HTML into DOM object
    var eTemp = document.createElement('div');
    if (params.data.form) {
      eTemp.innerHTML = this.getFormTemplate();
      this.eGui = eTemp.firstElementChild;
    } else {
      eTemp.innerHTML = this.getGridTemplate();
      this.eGui = eTemp.firstElementChild;
      this.setupDetailGrid(params.data.employees, params.api, params.node.id);
    }
  };

  DetailCellRenderer.prototype.getFormTemplate = function () {
    let formData = this.params.data.formData;

    let template =
      '<form>' +
      '  <div>' +
      '  <p>' +
      '    <label>' +
      '      Call Id:<br>' +
      '    <input type="text" value="' +
      formData.callId +
      '">' +
      '    </label>' +
      '  </p>' +
      '  <p>' +
      '    <label>' +
      '      Number:<br>' +
      '    <input type="text" value="' +
      formData.number +
      '">' +
      '    </label>' +
      '  </p>' +
      '  <p>' +
      '    <label>' +
      '      Direction:<br>' +
      '    <input type="text" value="' +
      formData.direction +
      '">' +
      '    </label>' +
      '  </p>' +
      '</form>' +
      '</div>';
    return template;
  };

  DetailCellRenderer.prototype.setupDetailGrid = function () {
    var eDetailGrid = this.eGui.querySelector('.full-width-grid');
    var detailGridOptions = {
      columnDefs: [{ field: 'name', cellRenderer: 'agGroupCellRenderer' }],
      defaultColDef: {
        flex: 1,
        minWidth: 150,
      },
      rowData: this.params.data.employees,
      masterDetail: true,
      isRowMaster: (data) =>
        data.form || (data.employees && data.employees.length > 0),
      detailCellRenderer: 'myDetailCellRenderer',
      components: {
        myDetailCellRenderer: getDetailCellRenderer(),
      },
      getRowHeight: (params) => {
        var isDetailRow = params.node.detail;

        // for all rows that are not detail rows, return nothing
        if (!isDetailRow) {
          return undefined;
        }

        if (params.data.form) {
          return 70;
        } else {
          return 310;
        }
      },
    };

    new agGrid.Grid(eDetailGrid, detailGridOptions);

    this.detailGridApi = detailGridOptions.api;

    var masterGridApi = this.params.api;
    var rowId = this.params.node.id;

    var gridInfo = {
      id: rowId,
      api: detailGridOptions.api,
      columnApi: detailGridOptions.columnApi,
    };

    console.log('adding detail grid info with id: ', rowId);
    masterGridApi.addDetailGridInfo(rowId, gridInfo);
  };

  DetailCellRenderer.prototype.getGridTemplate = function () {
    var data = this.params.data;
    var template =
      '<div class="full-width-panel">' +
      '  <div class="full-width-details">' +
      '    <div class="full-width-detail"><b>Name: </b>' + data.name + '</div>' +
      '  </div>' +
      '  <div class="full-width-grid ag-theme-alpine"></div>' +
      '</div>';

    return template;
  };

  DetailCellRenderer.prototype.getGui = function () {
    return this.eGui;
  };

  // DetailCellRenderer.prototype.destroy = function () {
  //   var rowId = this.params.node.id;
  //   console.log('removing Grid Info with id: ' + rowId);
  //   var masterGridApi = this.params.api;
  //   masterGridApi.removeDetailGridInfo(rowId);

  //   console.log('destroying detail grid');
  //   this.detailGridApi.destroy();
  // };

  return DetailCellRenderer;
}
