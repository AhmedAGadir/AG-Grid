var columnDefs = [
    {headerName: 'Make', field: 'make'},
    {headerName: 'Model', field: 'model'},
    {headerName: 'Price', field: 'price', cellRenderer: 'agAnimateShowChangeCellRenderer'},
];

const rowData = [
    {make: "Toyota", model: "Celica", price: "30000"},
    {make: "Ford", model: "Mondeo", price: "40000"},
    {make: "Porsche", model: "Boxter", price: "70000"}
]

var immutableStore;
function updatePrices() {
    var newStore = [];
    rowData.forEach(car => {
        newStore.push({
            make: car.make,
            model: car.model,
            // random price
            price: Math.floor(Math.random() * 100) * 1000
        })
    })
    immutableStore = newStore;
    gridOptions.api.setRowData(immutableStore);
}

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    deltaRowDataMode:true,
    getRowNodeId: data => data.make
};

document.addEventListener('DOMContentLoaded', function() {
    new agGrid.Grid(document.querySelector('#myGrid'), gridOptions);
});
