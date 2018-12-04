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

document.querySelector('button').addEventListener('click', myDebouncedFn)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var myDebouncedFn = debounce(function () {
    console.log('hi')
    upsertNRows(60);
}, 250);


function upsertNRows(n) {
    // fetch n random rows
    let rows = fetchNRandRows(n)

    rows
        .then(rows => {
            // get an array of all current id's in the grid
            let idArr = [];
            gridOptions.api.forEachNode(node => idArr.push(node.id))

            // randomly update 50% of the rows 
            rows = rows.map(row => (Math.random() < 0.5 ? updateRow(row) : row));

            // update the grid
            let transactionObj = {
                add: [],
                update: []
            };

            rows.forEach(row => {
                if (idArr.includes(row.id)) {
                    transactionObj.update.push(row)
                } else {
                    transactionObj.add.push(row)
                }
            });

            gridOptions.api.updateRowData(transactionObj)
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
            gridOptions.api.setRowData(data.slice(0, 1000)); //initially load the first 1000 rows
        });
});


// function uuidv4() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }
