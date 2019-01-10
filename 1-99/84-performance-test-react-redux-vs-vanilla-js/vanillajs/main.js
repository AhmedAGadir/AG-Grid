var immutableStore = [];

function update1Row() {
    console.time('[UPDATE_1_ROW]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 1; i++) {
        const randInd = Math.floor(Math.random() * newStore.length);
        newStore[randInd].age += randomSeed();
    }
    gridOptions.api.setRowData(newStore);
    console.timeEnd('[UPDATE_1_ROW]');
}

function delete1Row() {
    console.time('[DELETE_1_ROW]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 1; i++) {
        const randInd = Math.floor(Math.random() * newStore.length);
        newStore.splice(randInd, 1);
    }
    gridOptions.api.setRowData(newStore)
    console.timeEnd('[DELETE_1_ROW]');
}

function add1Row() {
    console.time('[ADD_1_ROW]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 1; i++) {
        const randInd = Math.floor(Math.random() * newStore.length);
        newStore.push({
            ...newStore[randInd],
            symbol: createUniqueRandomSymbol()
        })
    }
    gridOptions.api.setRowData(newStore)
    console.timeEnd('[ADD_1_ROW]');
}

function update100Rows() {
    console.time('[UPDATE_100_ROWS]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 100; i++) {
        const randInd = Math.floor(Math.random() * newStore.length);
        newStore[randInd].age += randomSeed();
    }
    gridOptions.api.setRowData(newStore);
    console.timeEnd('[UPDATE_100_ROWS]');
}

function delete100Rows() {
    console.time('[DELETE_100_ROWS]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 100; i++) {
        const randInd = Math.floor(Math.random() * newStore.length);
        newStore.splice(randInd, 1);
    }
    gridOptions.api.setRowData(newStore)
    console.timeEnd('[DELETE_100_ROWS]');
}

function add100Rows() {
    console.time('[ADD_100_ROWS]');
    const newStore = immutableStore.map(data => ({ ...data }));
    for (let i = 0; i < 100; i++) {
        const randInd = Math.floor(Math.random() * newStore.length);
        newStore.push({
            ...newStore[randInd],
            symbol: createUniqueRandomSymbol()
        })
    }
    gridOptions.api.setRowData(newStore)
    console.timeEnd('[ADD_100_ROWS]');
}

var gridOptions = {
    columnDefs: [
        { headerName: 'Athlete', field: 'athlete' },
        { headerName: 'Sport', field: 'sport' },
        { headerName: 'Age', field: 'age' },
        { headerName: 'Year', field: 'year' },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Gold', field: 'gold' },
        { headerName: 'Silver', field: 'silver' },
        { headerName: 'Bronze', field: 'bronze' },
    ],
    defaultColDef: {
        width: 150,
    },
    deltaRowMode: true,
    getRowNodeId: data => data.symbol,
    rowData: null,
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            data.forEach(d => {
                d.symbol = createUniqueRandomSymbol();
                immutableStore.push(d);
            })
            gridOptions.api.setRowData(immutableStore);

            update1Row();
            update100Rows();
            delete1Row();
            delete100Rows();
            add1Row();
            add100Rows();
        });
});

function randomSeed() {
    return Math.floor(Math.random() * 4) + 1;
}


function createUniqueRandomSymbol() {
    var symbol;
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var isUnique = false;
    while (!isUnique) {
        symbol = '';
        // create symbol
        for (var i = 0; i < 10; i++) {
            symbol += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        // check uniqueness
        isUnique = true;
        immutableStore.forEach(function (oldItem) {
            if (oldItem.symbol === symbol) {
                isUnique = false;
            }
        });
    }
    return symbol;
}