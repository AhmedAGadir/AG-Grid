var gridOptions = {
  columnDefs: [
    { field: 'athlete', minWidth: 150 },
    { field: 'age', maxWidth: 90 },
    { field: 'country', rowGroup: true, minWidth: 150 },
    { field: 'year', rowGroup: true, maxWidth: 90 },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  getRowStyle: params => {
    if (params.node.group) {
      let isAnyChildSelected = params.node.allLeafChildren.some(childNode => childNode.selected);
      return {
        backgroundColor: isAnyChildSelected ? 'limegreen' : 'none'
      }
    }
  },
  onRowSelected: params => {
    let selectedNode = params.node;
    let parent = params.node.parent;
    while (parent && parent.id !== 'ROOT_NODE_ID')  {
      params.api.redrawRows({rowNodes: [parent]});
      parent = parent.parent;
    }

  },
  rowSelection: 'single',
  onFirstDataRendered: params => {
    params.columnApi.autoSizeAllColumns();
  }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  // do http request to get our sample data - not using any framework to keep the example self contained.
  // you will probably use a framework like JQuery, Angular or something else to do your HTTP calls.
  var httpRequest = new XMLHttpRequest();
  httpRequest.open(
    'GET',
    'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
  );
  httpRequest.send();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      var httpResult = JSON.parse(httpRequest.responseText);
      gridOptions.api.setRowData(httpResult);
    }
  };
});
