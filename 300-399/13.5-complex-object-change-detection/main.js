var rowData = [
    { 
        athlete: 'Michael Phelps',
        sport: 'Swimming',
        id: 0
    },
    { 
        athlete: 'Natalie Coughlin',
        sport: 'Swimming',
        id: 1
    },
    { 
        athlete: 'Aleksey Nemov',
        sport: 'Gymnastics',
        id: 2
    },
    
]

var columnDefs = [
    {  
        headerName: 'Athlete Data',
        cellRenderer: 'myCellRenderer',
        valueGetter: params => ({
            name: params.data.athlete,
            sport: params.data.sport
        }),
        equals: (oldValue, newValue) => {
            let oldNameEqual = oldValue.name === newValue.name;
            let oldSportEqual = oldValue.sport === newValue.sport;
            return oldNameEqual && oldSportEqual;
        }
    },
];

var gridOptions = {
    columnDefs: columnDefs,
    deltaRowDataMode: true,
    getRowNodeId: data => data.id,
    rowData: rowData,
    components: {
        myCellRenderer: MyCellRenderer
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

function update() {
    let updatedRowData = rowData.map(row => ({
        ...row,
        athlete: row.id === 0 ? row.athlete.split(' ').reverse().join(' ') : row.athlete
    }));
    rowData = updatedRowData;
    gridOptions.api.setRowData(rowData);
}

function MyCellRenderer() {}

MyCellRenderer.prototype.init = function(params) {
    console.log('[MyCellRenderer]init');
    this.eGui = document.createElement('span');
    this.eGui.innerText = `${params.value.name} - ${params.value.sport}`;
}

MyCellRenderer.prototype.getGui = function() {
    return this.eGui;
}