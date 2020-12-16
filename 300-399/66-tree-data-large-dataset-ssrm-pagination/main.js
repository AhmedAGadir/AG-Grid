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
  paginationPageSize: 20,
  cacheBlockSize: 20,
  paginateChildRows: true,
  // paginationAutoPageSize: true,
  // onPaginationChanged: params => {
  //   if (params.newPage) {
  //     expandAll();
  //   }
  // }
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
      let multipliedData = repeatData(data, 100);
      console.log('multipliedData', multipliedData)
      var fakeServer = createFakeServer(multipliedData);
      var datasource = createServerSideDatasource(fakeServer);
      gridOptions.api.setServerSideDatasource(datasource);
    });
});

function repeatData(data, n) {
  let result = [];
  for (let i = 1; i <= n; i++) {
    let copiedRow = copyRows(i, data);
    result.push(...copiedRow);
  };
  return result;
}


function copyRows(i, data) {
  return data.map(record => {
    let newRecord = {
      ...record,
      employeeName: record.employeeName + ' ' + i,
      employeeId: record.employeeId + ('foo').repeat(i),
    };
    if (record.hasOwnProperty('children')) {
      newRecord.children = copyRows(i, record.children)
    }
    return newRecord
  })
}

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
        })
        .slice(request.startRow, request.endRow);
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
    var paginationPageSize = 100;
    var lastRow = params.request.groupKeys.length > 0 ? rows.length: paginationPageSize;
    setTimeout(function () {
      params.successCallback(rows, lastRow);
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
