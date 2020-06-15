var gridOptions = {
  columnDefs: [
    { field: 'athlete', cellEditor: 'myCellEditor' },
    { field: 'age', cellEditor: 'myCellEditor' },
    // {field: 'country'}
  ],
  defaultColDef: {
    editable: true,
    flex: 1,
  },
  components: {
    myCellEditor: MyCellEditor,
  },
  editType: 'fullRow',
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json',
    })
    .then(function(data) {
      gridOptions.api.setRowData(data);
    });
});

function MyCellEditor() {}

MyCellEditor.prototype.init = function(params) {
  console.log('[MyCellEditor]init');
  this.params = params;
  this.eGui = document.createElement('input');
  this.eGui.className = 'ag-input-field-input ag-text-field-input';
  this.eGui.style.height = '100%';
  this.eGui.type = 'text';
  this.eGui.value = params.value;
  this.eGui.addEventListener('change', e => {
    this.eGui.value = e.target.value;
  });
};

MyCellEditor.prototype.getValue = function() {
  console.log('[MyCellEditor]getValue');
  return this.eGui.value;
};

MyCellEditor.prototype.getGui = function() {
  console.log('[MyCellEditor]getGui');
  return this.eGui;
};

MyCellEditor.prototype.afterGuiAttached = function() {
  console.log('[MyCellEditor]afterGuiAttached');
  if (this.params.column.colId === 'athlete') {
    this.focus();
  }
};

MyCellEditor.prototype.focusIn = function() {
  console.log('[MyCellEditor]focusIn');
  this.eGui.focus();
  this.eGui.select();
};

MyCellEditor.prototype.focus = function() {
  this.eGui.focus();
  this.eGui.select();
};
