function expandAll() {
  console.log('expandAll')
  let collapsedNodes = [];

  function popuplateCollapsedNodes() {
    gridOptions.api.forEachNode((node) => {
      if (node.group && !node.expanded) {
        collapsedNodes.push(node);
      }
    });
  }

  popuplateCollapsedNodes();

  function expandCollapsedNodes() {
    collapsedNodes.forEach((node) => node.setExpanded(true));
  }

  expandCollapsedNodes()

  onCacheBlockLoaded(gridOptions.api, function () {
    collapsedNodes = [];
    popuplateCollapsedNodes();
    if (collapsedNodes.length === 0) {
      return
    }
    expandAll();
  });
}

var columnDefs = [
  { field: 'employeeId', hide: true },
  { field: 'employeeName', hide: true },
  { field: 'jobTitle' },
  { field: 'employmentType' },
];

var gridOptions = {
  defaultColDef: {
    width: 240,
    resizable: true,
  },
  autoGroupColumnDef: {
    cellRendererParams: {
      innerRenderer: function (params) {
        return params.data.employeeName;
      },
    },
  },
  rowModelType: 'serverSide',
  treeData: true,
  columnDefs: columnDefs,
  animateRows: true,
  isServerSideGroup: function (dataItem) {
    return dataItem.group;
  },
  getServerSideGroupKey: function (dataItem) {
    return dataItem.employeeId;
  },
  onGridReady: function (params) {},
  pagination: true,
  paginationPageSize: 10,
  cacheBlockSize: 10,
  paginationAutoPageSize: true,
  paginateChildRows: true
};

document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/javascript-grid-server-side-model-tree-data/tree-data/data/data.json',
    })
    .then(function (data) {
      var fakeServer = createFakeServer(data);
      var datasource = createServerSideDatasource(fakeServer);
      gridOptions.api.setServerSideDatasource(datasource);
    });
});

function createFakeServer(fakeServerData) {
  function FakeServer(allData) {
    this.data = allData;
  }

  FakeServer.prototype.getData = function (request) {
    function extractRowsFromData(groupKeys, data) {
      if (groupKeys.length === 0) {
        return data.map(function (d) {
          return {
            group: !!d.children,
            employeeId: d.employeeId,
            employeeName: d.employeeName,
            employmentType: d.employmentType,
            jobTitle: d.jobTitle,
          };
        });
      }

      var key = groupKeys[0];
      for (var i = 0; i < data.length; i++) {
        if (data[i].employeeId === key) {
          return extractRowsFromData(
            groupKeys.slice(1),
            data[i].children.slice()
          );
        }
      }
    }

    return extractRowsFromData(request.groupKeys, this.data);
  };

  return new FakeServer(fakeServerData);
}

function createServerSideDatasource(fakeServer) {
  function ServerSideDatasource(fakeServer) {
    this.fakeServer = fakeServer;
  }

  ServerSideDatasource.prototype.getRows = function (params) {
    console.log('ServerSideDatasource.getRows: params = ', params);

    var rows = this.fakeServer.getData(params.request);

    setTimeout(function () {
      params.successCallback(rows, rows.length);
    }, 200);
  };

  return new ServerSideDatasource(fakeServer);
}

function onCacheBlockLoaded(api, cb) {
  var interval = setInterval(() => {
    if (checkIfBlocksLoaded(api)) {
      clearInterval(interval);
      cb(api);
    }
  }, 500);

  function checkIfBlocksLoaded(api) {
    if (api.getCacheBlockState() === null) return false;

    let status = api.getCacheBlockState()[0]
      ? api.getCacheBlockState()[0].pageStatus
      : false;

    return status === 'loaded';
  }
}
