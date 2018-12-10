var columnDefs = [
    {
        headerName: 'Price', 
        field: 'price',
        colSpan: function(params) {
            var price = params.data.price;
            if (price >= 66) {
                return 3;
            } else if (price <= 33) {
                return 1;
            } else {
                return 2
            }
        }
    },
    {headerName: 'Symbol', field: 'symbol'},
    {headerName: 'Group', field: 'group'}
];

function getInitialData() {
    var data = [];
    for (var i = 0; i < 10; i++) {
        data.push(createItem());
    }

    return data;
}

var immutableStore;

function addFiveItems(append) {
    var newStore = immutableStore.slice();
    for (var i = 0; i < 5; i++) {
        var newItem = createItem();
        if (append) {
            newStore.push(newItem);
        } else {
            newStore.splice(0,0,newItem);
        }
    }
    immutableStore = newStore;
    gridOptions.api.setRowData(immutableStore);
}

function updatePrices() {
    var newStore = [];
    immutableStore.forEach(function(item) {
        newStore.push({
            // use same symbol as last time, this is the unique id
            symbol: item.symbol,
            // group also stays the same
            group: item.group,
            // add random price
            price: Math.floor(Math.random() * 100)
        });
    });
    immutableStore = newStore;
    gridOptions.api.setRowData(immutableStore);
}

function createItem() {
    var item = {
        group: 'A',
        symbol: createUniqueRandomSymbol(),
        price: Math.floor(Math.random() * 100)
    };
    return item;
}

// creates a unique symbol, eg 'ADG' or 'ZJD'
function createUniqueRandomSymbol() {
    var symbol;
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var isUnique = false;
    while (!isUnique) {
        symbol = '';
        // create symbol
        for (var i = 0; i < 3; i++) {
            symbol += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        // check uniqueness
        isUnique = true;
        immutableStore.forEach(function(oldItem) {
            if (oldItem.symbol === symbol) {
                isUnique = false;
            }
        });
    }

    return symbol;
}

var gridOptions = {
    deltaRowDataMode: true,
    columnDefs: columnDefs,
    rowData: immutableStore,
    getRowNodeId: function(data) {
        return data.symbol;
    },
    onGridReady: function(params) {
        immutableStore = [];
        immutableStore = getInitialData();
        params.api.setRowData(immutableStore);

    }
};

// after page is loaded, create the grid.
document.addEventListener('DOMContentLoaded', function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});
