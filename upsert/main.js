var columnDefs = [
    { headerName: 'Athlete', field: 'athlete' },
    { headerName: 'Sport', field: 'sport' },
    { headerName: 'Age', field: 'age' },
    { headerName: 'Year', field: 'year' },
    { headerName: 'Date', field: 'date' },
    { headerName: 'Gold', field: 'gold' },
    { headerName: 'Silver', field: 'silver' },
    { headerName: 'Bronze', field: 'bronze' },
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        width: 150,
    },
    rowData: [],
    getRowNodeId: data => data.id
};

document.querySelector('button').addEventListener('click', () => upsertNRows(60))

function upsertNRows(n) {
    // fetch n random rows
    let rows = fetchNRows(n)

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
            })
            gridOptions.api.updateRowData(transactionObj)
        })
        .catch(err => console.log(err))

}

function fetchNRows(n) {
    return new Promise((resolve, reject) => {
        fetch('./data.json')
            .then(res => res.json())
            .then(data => data.slice(0, 2000)) // only using the first 2000 rows
            .then(data => {
                let rows = [];
                let x = 0;
                while (x < n) {
                    let randInd = Math.floor(Math.random() * data.length);
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


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
