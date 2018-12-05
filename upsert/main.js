var columnDefs = [
    { headerName: 'Athlete', field: 'athlete' },
    { headerName: 'Sport', field: 'sport' },
    { headerName: 'Age', field: 'age' },
    { headerName: 'Year', field: 'year' },
    { headerName: 'Date', field: 'date' },
    { headerName: 'Gold', field: 'gold' },
    { headerName: 'Silver', field: 'silver' },
    { headerName: 'Bronze', field: 'bronze' },
    { headerName: 'Total', field: 'total' }
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        width: 150,
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        enableCellChangeFlash: true
    },
    rowData: [],
    getRowNodeId: data => data.id
};


function upsertNRows(n) {
    // fetch n random rows
    fetchNRandRows(n)
        .then(randomRowsToUpsert => {
            // get an array of all current id's in the grid
            let transactionObj = {
                add: [],
                update: []
            };

            let randomSeed = Math.floor(Math.random() * 3) // between 0 and 3;

            randomRowsToUpsert.forEach(randomRowToUpsert => {
                let alreadyAdded = gridOptions.api.getRowNode(randomRowToUpsert.id);
                if (alreadyAdded) {
                    transactionObj.update.push(updateRow(randomRowToUpsert, randomSeed));
                } else {
                    transactionObj.add.push(randomRowToUpsert);
                }
            })

            gridOptions.api.updateRowData(transactionObj);
        })
        .catch(err => console.log(err))

}

function fetchNRandRows(n) {
    return new Promise((resolve, reject) => {
        fetch('./data.json')
            .then(res => res.json())
            .then(data => {
                let remainingCandidates = data.slice(0);
                let result = [];

                for (let i = 0; i < n; i++) {
                    let randIndex = Math.floor(Math.random() * remainingCandidates.length); // random index between 0 and remainingCandidates.length
                    result.push(remainingCandidates[randIndex]);
                    remainingCandidates.splice(randIndex, 1);
                }

                resolve(result);
            })
            .catch(err => reject(err))
    })
}

function updateRow(row, seed) {
    let updatedRow = { ...row }
    updatedRow.age = updatedRow.age + seed;
    updatedRow.gold = updatedRow.gold + seed;
    updatedRow.silver = updatedRow.silver + seed;
    updateRow.bronze = updatedRow.bronze + seed;
    updatedRow.total += updatedRow.gold + updatedRow.silver + updatedRow.bronze;
    return updatedRow
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    fetch('./data.json')
        .then(res => res.json())
        .then(function (data) {
            gridOptions.api.setRowData(data.slice(0, 500)); // initially load the first 500 rows
        });

    setInterval(() => upsertNRows(1000), 1000)
});
