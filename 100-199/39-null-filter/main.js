var columnDefs = [
  {
    field: "athlete",
    width: 150
  },
  {
    field: "age",
    width: 90,
    filter: 'agNumberColumnFilter',
    filterParams: {
      suppressAndOrCondition: true,
      filterOptions: [
        {
          displayKey: 'lessThan',
          displayName: 'Less Than',
          test: function (filterValue, cellValue) {
            return cellValue !== null && cellValue < filterValue;
          }
        },
        {
          displayKey: 'greaterThan',
          displayName: 'Greater Than',
          test: function (filterValue, cellValue) {
            return cellValue !== null && cellValue > filterValue;
          }
        },
        {
          displayKey: 'isNull',
          displayName: 'Is Null',
          test: function (filterValue, cellValue) {
            return cellValue === null;
          }
        }
      ]
    }
  }
];

var gridOptions = {
  columnDefs: columnDefs,
  defaultColDef: {
    sortable: true,
    filter: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
  },
  postProcessPopup: function (params) {
    debugger;
    // check callback is for menu
    if (params.type !== 'columnMenu') {
      return;
    }
    console.log('adding event listener');
    if (params.node.filter)
      params.ePopup.querySelector('select').addEventListener('change', myFunc);

    var myFunc = e => {
      console.log(e.target.value)
      if (e.target.value === 'isNull') {
        console.log(123)
        params.ePop.querySelector('input[type="text"]').value = 'bob';
      }
    }
  }
}
// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid.simpleHttpRequest({ url: 'https://raw.githubusercontent.com/ag-grid/ag-grid/latest/packages/ag-grid-docs/src/javascript-grid-filtering/custom-filter-options/data/data.json' })
    .then(function (data) {
      gridOptions.api.setRowData(data);
    }
    );
});