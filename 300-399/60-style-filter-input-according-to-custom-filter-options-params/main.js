var gridOptions = {
  columnDefs: [
    { field: 'athlete', minWidth: 150, filter: false },
    {
      field: 'age',
      filter: 'agNumberColumnFilter',
      filterParams: {
        suppressAndOrCondition: true,
        filterOptions: [
          'lessThan',
          {
            displayKey: 'lessThanWithNulls',
            displayName: 'Less Than with Nulls',
            test: function (filterValue, cellValue) {
              return cellValue == null || cellValue < filterValue;
            },
            styles: {
              background: 'lightpink'
            },
          },
          'greaterThan',
          {
            displayKey: 'greaterThanWithNulls',
            displayName: 'Greater Than with Nulls',
            test: function (filterValue, cellValue) {
              return cellValue == null || cellValue > filterValue;
            },
            styles: {
              background: 'lightgreen'
            },
          },
        ],
      },
    },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  enableRangeSelection: true,
  onFilterModified: params => {
    console.log('onFilterModified');
    const filterOptions = params.column.colDef.filterParams.filterOptions;
    const dropDownOption = params.filterInstance.eGui.firstElementChild.firstElementChild.innerText
    const inputEl = params.filterInstance.eCondition1Body.querySelector('input');

    const appliedFilterOptionIndex = filterOptions.findIndex(fO => fO.displayName === dropDownOption);

    if (appliedFilterOptionIndex === -1) {
      inputEl.style.backgroundColor = 'white';
      return;
    }

    const stylesToApply = filterOptions[appliedFilterOptionIndex].styles;

    Object.entries(stylesToApply).forEach(([key, value]) => {
      inputEl.style[key] = value;
    });

  }
};

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
      gridOptions.api.setRowData(data);
    });
});
