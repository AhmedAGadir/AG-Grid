var columnDefs = [
  {
    headerName: 'Athlete Details',
    headerGroupComponent: 'customHeaderGroupComponent',
    children: [
      {
        colId: 'shadow',
        hide: true,
        menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
      },
      {
        headerName: 'Athlete',
        field: 'athlete',
        width: 180,
        filter: 'agTextColumnFilter',
      },
      {
        headerName: 'Age',
        field: 'age',
        width: 90,
        filter: 'agNumberColumnFilter',
      },
      { headerName: 'Country', field: 'country', width: 140 },
    ],
  }
];

var gridOptions = {
  defaultColDef: {
    sortable: true,
    resizable: true,
  },
  columnDefs: columnDefs,
  rowData: null,
  components: {
    customHeaderGroupComponent: CustomHeaderGroup,
  },
  getMainMenuItems: getMainMenuItems,
};

function getMainMenuItems(params) {
  switch (params.column.getId()) {
    case 'shadow': 
      return [
        'autoSizeAll'
      ]
    default:
      return params.defaultItems;
  }
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url: 'https://www.ag-grid.com/example-assets/olympic-winners.json',
    })
    .then(function (data) {
      gridOptions.api.setRowData(data);
    });
});
