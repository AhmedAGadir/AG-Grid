var gridOptions = {
  columnDefs: [
    { field: 'age', maxWidth: 90 },
    { field: 'country', minWidth: 150 },
    { field: 'year', maxWidth: 90 },
    { field: 'date', minWidth: 150 },
    { field: 'sport', rowGroup: true, minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ],
  autoGroupColumnDef: {
    minWidth: 200,
    field: 'athlete',
    cellRenderer: 'myRenderer',
  },
  defaultColDef: {
    // cellRenderer: 'myRenderer',
    resizable: true,
    flex: 1,
    minWidth: 100,
  },
  components: {
    myRenderer: MyRenderer,
  },
  enableRangeSelection: true,
  groupDefaultExpanded: -1,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url: 'https://www.ag-grid.com/example-assets/olympic-winners.json',
    })
    .then(function (data) {
      gridOptions.api.setRowData(data.slice(0, 20));
    });
});

function MyRenderer() {}

MyRenderer.prototype.init = function (params) {
  this.params = params;
  if (params.node.group) {
    let container = document.createElement('div');
    container.innerHTML = `
      <div>
        <span class="expand"><img src="./chevron-right.svg"/></span>
        <span class="contract"><img src="./chevron-down.svg"/></span>
        <span class="value"></span>
      </div>
    `;
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = container.innerHTML;

    this.eGui
      .querySelector('.expand')
      .addEventListener('click', () => {
        this.toggleExpanded();
        this.updateGroupIcons();
      });
    this.eGui
      .querySelector('.contract')
      .addEventListener('click', () => {
        this.toggleExpanded();
        this.updateGroupIcons();
      });

    this.updateGroupIcons();

    this.eGui.querySelector('.value').appendChild(this.createInput());
  } else {
    this.eGui = document.createElement('div');
    this.eGui.appendChild(this.createInput());
  }
};

MyRenderer.prototype.getGui = function (params) {
  return this.eGui;
};

MyRenderer.prototype.refresh = function (params) {
  this.params = params;
  return true;
};

MyRenderer.prototype.updateGroupIcons = function () {
  console.log(this.params.node);
  this.eGui.querySelector('.expand').style.display = this.params.node.expanded
    ? 'inline-block'
    : 'none';
  this.eGui.querySelector('.contract').style.display = this.params.node.expanded
    ? 'none'
    : 'inline-block';
};

MyRenderer.prototype.createInput = function () {
  let input = document.createElement('input');
  input.value = this.params.value ? this.params.value : '';
  input.addEventListener('input', (e) => {
    this.params.node.setDataValue(this.params.column.colId, e.target.value);
    console.log(this.params.node.data);
  });
  return input;
};

MyRenderer.prototype.toggleExpanded = function() {
  this.params.node.setExpanded(!this.params.node.expanded);
}