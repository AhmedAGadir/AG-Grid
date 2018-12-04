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

const debounce = (func, delay) => {
    let inDebounce
    return function () {
        const context = this
        const args = arguments
        clearTimeout(inDebounce)
        inDebounce = setTimeout(() => func.apply(context, args), delay)
    }
}

function upsertNRows(n) {
    // fetch n random rows
    fetchNRandRows(n)
        .then(rows => {
            // get an array of all current id's in the grid
            let idArr = [];
            gridOptions.api.forEachNode(node => idArr.push(node.id))

            let transactionObj = {
                add: [],
                update: []
            };

            // update the rows that are already in the grid
            rows.forEach(row => {
                if (idArr.includes(row.id)) {
                    let updatedRow = updateRow(row)
                    transactionObj.update.push(updatedRow)
                } else {
                    transactionObj.add.push(row)
                }
            });

            console.log('transcation object add length', transactionObj.add.length, ', transaction object update length', transactionObj.update.length)
            gridOptions.api.updateRowData(transactionObj);
        })
        .catch(err => console.log(err))

}

function fetchNRandRows(n) {
    return new Promise((resolve, reject) => {
        fetch('./data.json')
            .then(res => res.json())
            .then(data => {
                let rows = [];
                let x = 0;
                while (x < n) {
                    let randInd = Math.floor(Math.random() * data.length); // random index between 0 and 2000
                    rows.push(data[randInd])
                    x++
                }
                resolve(rows);
            })
            .catch(err => reject(err))
    })
}

function updateRow(row) {
    let updatedRow = { ...row }
    updatedRow.age++
    updatedRow.gold++
    updatedRow.silver++
    updateRow.bronze++
    updatedRow.total += 3
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

    setInterval(() => debounce(upsertNRows(100), 1450), 1500)
});


// function uuidv4() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }
