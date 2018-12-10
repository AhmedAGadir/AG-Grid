var rowData = [
    {shape: 'Circle', color: 'Blue'},
    {shape: 'Square', color: 'Red'},
    {shape: 'Circle', color: 'Green'},
    {shape: 'Traingle', color: 'Green'},
    {shape: 'Traingle', color: 'Blue'},
    {shape: 'Square', color: 'Blue'},
    {shape: 'Circle', color: 'Red'},
    {shape: 'Traingle', color: 'Red'},
    {shape: 'Square', color: 'Green'},
]

var columnDefs1 = [
    {
        headerName: "Shape", 
        showRowGroup: true, 
        cellRenderer: 'agGroupCellRenderer', 
        cellRendererParams: {suppressCount: true}
    },
    {
        field: 'shape', 
        rowGroup: true, 
        hide: true
    },
    {
        headerName: "Color", 
        field: "color"
    }
];

var columnDefs2 = [
    {
        headerName: "Group", 
        colId: 'group', 
        showRowGroup: true,
        cellRenderer: 'agGroupCellRenderer',
        cellRendererParams: {
            innerRenderer: (params) => params.value.split('/') [1],
            suppressCount: true
        }
    },
    {
        headerName: "Shape and Color",
        rowGroup: true,
        valueGetter:  (params) => {
            // if (params.node.group){
            //     console.log('called')
            //     debugger;
            //     return '?';
            // }
            return params.data.color + '/' + params.data.shape
        },
        hide: true
    },
    {
        headerName: "Color", 
        field: "color"
    },
];

var columnDefsArr = [columnDefs1, columnDefs2]
let ind = 0;

function toggleColumnDefs() {
    ind = (ind == 0) ? 1 : 0 
    gridOptions.api.setColumnDefs(columnDefsArr[ind])
}

var gridOptions = {
    columnDefs: columnDefsArr[ind],
    rowData: rowData,
    // using a custom group
    groupSuppressAutoColumn: true,
    enableSorting: true
};

document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});
