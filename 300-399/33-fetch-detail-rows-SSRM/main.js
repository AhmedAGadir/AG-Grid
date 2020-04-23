var fakeServer;
var datasource;

var columnDefs = [
  { field: 'country', rowGroup: true, hide: true },
  { field: 'calls', hide: true },
];

var defaultColDef = {
  flex: 1,
};

var autoGroupColumnDef = {
  field: 'calls',
};

var detailDefaultColDef = {
  flex: 1,
};

var detailColumnDefs = [
  { field: 'name' },
  { field: 'accountId' },
  { field: 'totalDuration' },
];

var gridOptions = {
  groupRemoveSingleChildren: true,
  columnDefs: columnDefs,
  defaultColDef: defaultColDef,
  autoGroupColumnDef: autoGroupColumnDef,
  animateRows: true,
  rowModelType: 'serverSide',
  masterDetail: true,
  onGridReady: onGridReady,
  detailCellRendererParams: {
    detailGridOptions: {
      columnDefs: detailColumnDefs,
      defaultColDef: detailDefaultColDef,
    },
    getDetailRowData: getDetailRowData,
  },
};

function getDetailRowData(params) {
  let DETAIL_ROW_COUNT_LIMIT = 1000;

  const ROW_GROUP_COLS = [
    {
      id: 'country',
      aggFunc: undefined,
      displayName: 'Country',
      field: 'country',
    },
    {
      id: 'calls',
      aggFunc: undefined,
      displayName: 'Calls',
      field: 'calls',
    },
  ];

  const GROUP_KEYS = [params.node.data.country, params.node.data.calls];

  let request = {
    startRow: 0,
    endRow: DETAIL_ROW_COUNT_LIMIT,
    rowGroupCols: ROW_GROUP_COLS,
    valueCols: [],
    pivotCols: [],
    pivotMode: false,
    groupKeys: GROUP_KEYS,
    filterModel: {},
    sortModel: [],
  };
  let response = fakeServer.getData(request);

  console.log('detail rows', response.rows);
  setTimeout(() => params.successCallback(response.rows), 500);
}

function ServerSideDatasource(server) {
  return {
    getRows: function(params) {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      var response = server.getData(params.request);
      setTimeout(function() {
        if (response.success) {
          params.successCallback(response.rows, response.lastRow);
        } else {
          params.failCallback();
        }
      }, 200);
    },
  };
}

document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/callData.json',
    })
    .then(function(data) {
      fakeServer = new FakeServer(data);
      datasource = new ServerSideDatasource(fakeServer);
      gridOptions.api.setServerSideDatasource(datasource);
    });
});

function onGridReady(params) {
  expandNodes('1', 'Estonia-2');
}

function expandNodes(...args) {
  args.forEach((id, pos) => {
    let timer = (pos + 1) * 1000;
    setTimeout(function() {
      var someRow = gridOptions.api.getRowNode(id);
      someRow.setExpanded(true);
    }, timer);
  });
}
