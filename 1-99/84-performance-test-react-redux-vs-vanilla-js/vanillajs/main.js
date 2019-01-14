var immutableStore = {
    rowData: null
};

function initRowData(data) {
    data.forEach(d => d.id = createUniqueRandomSymbol(data));
    immutableStore.rowData = data;
    gridOptions.api.setRowData(immutableStore.rowData);
}

function updateRows(_, n) {
    const indexSet = new Set();
    while (indexSet.size < n) {
        const randInd = getRandInd();
        if (indexSet.has(randInd)) {
            continue;
        }
        indexSet.add(randInd);
    }
    const updatedRows = immutableStore.rowData.map(row => ({ ...row }));
    [...indexSet].forEach(ind => {
        updatedRows[ind]['age'] += Math.floor(Math.random() * 4) + 1;
    });
    immutableStore.rowData = updatedRows;
    gridOptions.api.setRowData(immutableStore.rowData);
}

function deleteRows(_, n) {
    const indexSet = new Set();
    while (indexSet.size < n) {
        const randInd = getRandInd();
        if (indexSet.has(randInd)) {
            continue;
        }
        indexSet.add(randInd);
    }
    const updatedRows = immutableStore.rowData
        .map(row => Object.assign({}, row))
        .filter((_, ind) => ![...indexSet].includes(ind));
    immutableStore.rowData = updatedRows;
    gridOptions.api.setRowData(immutableStore.rowData);
}

function addRows(_, n) {
    const indexSet = new Set();
    const symbolSet = new Set();
    while (indexSet.size < n) {
        const randInd = getRandInd();
        const symbol = createUniqueRandomSymbol();
        if (indexSet.has(randInd) || symbolSet.has(symbol)) {
            continue;
        }
        indexSet.add(randInd);
        symbolSet.add(symbol);
    }
    const updatedRows = immutableStore.rowData.map(row => Object.assign({}, row));
    [...indexSet].forEach((rowInd, ind) => {
        updatedRows.push({
            ...updatedRows[rowInd],
            id: [...symbolSet][ind]
        })
    })
    immutableStore.rowData = updatedRows;
    gridOptions.api.setRowData(immutableStore.rowData);
}

function getRandInd() {
    return Math.floor(Math.random() * immutableStore.rowData.length);
}

function createUniqueRandomSymbol(data = immutableStore.rowData) {
    var symbol;
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    var isUnique = false;
    while (!isUnique) {
        symbol = '';
        for (var i = 0; i < 10; i++) {
            symbol += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        isUnique = true;
        if (data.some(row => row.id === symbol)) {
            isUnique = false;
        }
    }
    return symbol;
}

function logger(fn) {
    return function (...args) {
        console.group(fn.name);
        console.log('prev state', immutableStore);
        fn(...args);
        console.log('next state', immutableStore);
        console.groupEnd(fn.name);
    }
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
    getRowNodeId: data => data.id,
    rowData: immutableStore.rowData,
    onGridReady: () => {
        initRowData = logger(initRowData)
        updateRows = logger(updateRows);
        deleteRows = logger(deleteRows);
        addRows = logger(addRows);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(data => initRowData(data));
});

