var gridOptions = {
  columnDefs: [
    {
      headerName: 'Group',
      cellRenderer: 'agGroupCellRenderer',
      colId: 'group',
      showRowGroup: true,
      minWidth: 200,
    },
    { field: 'gold', colId: 'gold' },
    { field: 'silver', colId: 'silver' },
    { field: 'bronze', colId: 'bronze' },
    {
      headerName: 'Country',
      colId: 'country',
      rowGroup: true,
      valueGetter: countryValueGetter,
      valueFormatter: countryValueFormatter,
      keyCreator: countryKeyCreator,
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 150,
    resizable: true,
  },
  autoGroupColumnDef: {
    minWidth: 200,
  },
  groupDefaultExpanded: -1,
  groupSuppressAutoColumn: true,
  onNewColumnsLoaded: params => console.log('onNewColumnsLoaded'),
};

function updateKeyCreator() {
  let updatedColumnDefs = gridOptions.columnApi
    .getAllDisplayedColumns()
    .map(col => ({
      ...col.colDef,
      keyCreator: params =>
        col.colId === 'country' ? params.value.code : null,
    }));

  gridOptions.api.setColumnDefs(updatedColumnDefs);

  gridOptions.api.refreshClientSideRowModel();
}

function countryKeyCreator(params) {
  var countryObject = params.value;
  return countryObject.name;
}

function countryValueGetter(params) {
  if (params.node.group) {
    return;
  }
  // hack the data  - replace the country with an object of country name and code
  var countryName = params.data.country;
  var countryCode = countryName.substring(0, 2).toUpperCase();
  return {
    name: countryName,
    code: countryCode,
  };
}

function countryValueFormatter(params) {
  if (params.node.group) {
    return null;
  }
  return params.value.name;
}

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
