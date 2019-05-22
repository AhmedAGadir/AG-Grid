var columnDefs = [
    {
        headerName: 'Make',
        field: 'make',
        filter: 'agSetColumnFilter',
        filterParams: {
            suppressMiniFilter: true,
        },
        menuTabs: ['filterMenuTab'],
    },
    {
        headerName: 'Price',
        field: 'price',
    },
    {
        headerName: 'ID',
        field: 'id',
    },
];

var rowData = [
    {
        make: 'Toyota',
        price: 35000,
        id: 0,
    },
    {
        make: 'Ford',
        price: 32000,
        id: 1,
    },
    {
        make: 'Porsche',
        price: 72000,
        id: 2,
    },
];

function test() {
    console.log('before', gridOptions.api.getFilterModel());

    var makeFilterComponent = gridOptions.api.getFilterInstance('make');
    var model = makeFilterComponent.getModel();

    gridOptions.api.setRowData([]);

    var newItems = [createNewRowData(), createNewRowData(), createNewRowData()];
    // *** doesnt work ***
    gridOptions.api.updateRowData({ add: newItems });
    // *** works ***
    // gridOptions.api.setRowData(newItems);

    makeFilterComponent.resetFilterValues();

    makeFilterComponent.setModel(model);

    makeFilterComponent.onFilterChanged();

    console.log('after', gridOptions.api.getFilterModel());
}

var newCount = 3;
function createNewRowData() {
  var newData = {
    make: ['Toyota', 'Ford', 'Porsche'][newCount % 3],
    price: 35000 + newCount * 120,
    id: newCount,
  };
  newCount++;
  return newData;
}

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    getRowNodeId: data => data.id,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
