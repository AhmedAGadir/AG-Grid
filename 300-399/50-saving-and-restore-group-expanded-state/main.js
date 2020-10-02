var gridOptions = {
  columnDefs: [
    { field: 'athlete', minWidth: 150 },
    { field: 'age', maxWidth: 90 },
    { field: 'country', rowGroup: true, minWidth: 150 },
    { field: 'year', maxWidth: 90, rowGroup: true },
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
  enableRangeSelection: true,
  autoGroupColumnDef: {
    minWidth: 200,
  },
  onRowGroupOpened: onRowGroupOpened,
  onFirstDataRendered: onFirstDataRendered,
  onCellClicked: params => {
    console.log(getExpandedDetails(params.node))
  },
};

let restoringExpandedNodes = false;

function onFirstDataRendered(params) {
  let groupStorage = JSON.parse(localStorage.getItem('expanded_ag_grid_nodes'));
  console.log('onFirstDataRendered: expanded nodes', groupStorage);
  if (groupStorage) {
    restoringExpandedNodes = true;
    params.api.forEachNode(node => {
      if (node.group) {
        let expandedDetails = getExpandedDetails(node);
        let ind = groupStorage.findIndex(
          storageItem => storageItem === expandedDetails
        );
        if (ind !== -1) {
          node.setExpanded(true);
        }
      }
    });
    setTimeout(() => restoringExpandedNodes = false, 0);
  }
}

function onRowGroupOpened(params) {
  if (restoringExpandedNodes) {
    return;
  }
  let expandedNodeDetails = [];
  params.api.forEachNode(node => {
    if (node.group && node.expanded) {
      let expandedDetails = getExpandedDetails(node);
      expandedNodeDetails.push(expandedDetails);
    }
  });
  console.log('expandedNodeDetails are now', expandedNodeDetails);
  localStorage.setItem('expanded_ag_grid_nodes', JSON.stringify(expandedNodeDetails));
}

function getExpandedDetails(node, expandedDetails = '') {
  if (node.group && node.uiLevel >= 0) {
    if (expandedDetails === '') {
      expandedDetails = node.field + ':' + node.key
    } else {
      expandedDetails += '&' + node.field + ':' + node.key
    }
    return getExpandedDetails(node.parent, expandedDetails);
  }
  return expandedDetails;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json',
    })
    .then(function (data) {
      data = data.slice(0, 50);
      gridOptions.api.setRowData(data);
    });
});
