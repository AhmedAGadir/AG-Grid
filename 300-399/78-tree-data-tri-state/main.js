let updatingCheckboxesprogrammatically = false;
var gridOptions = {
  columnDefs: [{ field: 'jobTitle' }, { field: 'employmentType' }],
  defaultColDef: {
    flex: 1,
  },
  autoGroupColumnDef: {
    checkboxSelection: true,
    headerName: 'Organisation Hierarchy',
    minWidth: 300,
  },
  rowSelection: 'multiple',
  rowData: rowData,
  treeData: true,
  groupDefaultExpanded: -1,
  getDataPath: function (data) {
    return data.orgHierarchy;
  },
  onRowSelected: onRowSelected,
};

function onRowSelected(params) {
  if (updatingCheckboxesprogrammatically) {
    return;
  }

  updatingCheckboxesprogrammatically = true;

  setChildrenSelectionStatus(params.node, params.node.selected);
  refreshParentsSelectionStatusRecursively(params.node);

  setTimeout(() => {
    updatingCheckboxesprogrammatically = false;
  }, 0);
}

function setChildrenSelectionStatus(node, selected) {
  let hasChildren = node.allChildrenCount > 0;
  if (hasChildren) {
    node.allLeafChildren.forEach((child) => {
      child.setSelected(selected);
    });
  }
}

function refreshParentsSelectionStatusRecursively(node) {
  let parentNode = node.parent;
  while (parentNode) {
    if (parentNode.id === 'ROOT_NODE_ID') {
      break;
    }
    refreshSelectionStatus(parentNode);
    parentNode = parentNode.parent;
  }
}

function refreshSelectionStatus(node) {
  let childrenSelectionStatus = node.allLeafChildren.map(
    (node) => node.selected
  );
  childrenSelectionStatus.shift();

  let nodeSelectionStatus = childrenSelectionStatus.reduce((a, b) => {
    if (a === b) {
      return a;
    }
    return undefined;
  });

  node.selectThisNode(nodeSelectionStatus);
}

document.addEventListener('DOMContentLoaded', function () {
  var eGridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(eGridDiv, gridOptions);
});
