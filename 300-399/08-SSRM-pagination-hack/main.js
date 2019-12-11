var pageSize= 10;

var gridOptions = {
  columnDefs: [
    { headerName: 'Job Order ID', field: 'jobOrderNumber', rowDrag: true },
    { headerName: 'Order Name', field: 'jobOrderName' },
    { headerName: 'Order Time & Date', field: 'installationDate' },
    { headerName: 'Customer', field: 'customer.name' },
    { headerName: 'SO Ref.', field: 'salesOrder.salesOrderNumber' },
  ],
  rowModelType: 'serverSide',
  maxBlocksInCache: 10,
  pagination: true,
  paginationPageSize: pageSize,
  onGridReady: params => params.api.sizeColumnsToFit(),
};

function onPageSizeChanged(params) {
  pageSize = Number(document.getElementById('pageSizeSelection').value);

  gridOptions.api.paginationSetPageSize(pageSize);
  gridOptions.api.purgeServerSideCache();

}

document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
      var datasource = new ServerSideDatasource();
      gridOptions.api.setServerSideDatasource(datasource);
});

function ServerSideDatasource(server) {
  return {
    getRows: function(params) {
      fetch(`https://demo4928733.mockable.io/job-orders(1-${pageSize})`)
        .then(res => res.json())
        .then(({data}) => {
          let rows = data.map(row => ({...row.jobOrder}));
          params.successCallback(rows, rows.length);
        })
        .catch(err => {
          console.log(err);
          params.failCallback();
        });
    },
  };
}
