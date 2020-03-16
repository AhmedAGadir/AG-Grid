let updating = false;

// specify the columns
var columnDefs = [
    { 
        field: 'cost', 
        width: 200,
        editable: true,
        valueParser: params => +params.newValue
         },
];

// specify the data
var rowData = [
    {
        orgHierarchy: ['Erica Rogers'],
        cost: 500,
        id: 0
    },
    {
        orgHierarchy: ['Erica Rogers', 'Malcolm Barrett'],
        cost: 300,
        id: 1
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Leah Flowers',
        ],
        cost: 150,
        id: 2
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Tammy Sutton',
        ],
        cost: 150,
        id: 3
    },
    {
        orgHierarchy: ['Erica Rogers', 'Francis Strickland'],
        cost: 200,
        id: 4
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Francis Strickland',
            'Morris Hanson',
        ],
        cost: 120,
        id: 5
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Francis Strickland',
            'Todd Tyler',
        ],
        cost: 80,
        id: 6
    },
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    treeData: true, // enable Tree Data mode
    animateRows: true,
    groupDefaultExpanded: -1, // expand all groups by default
    getDataPath: function(data) {
        return data.orgHierarchy;
    },
    getRowNodeId: data => data.id,
    autoGroupColumnDef: {
        headerName: 'Organisation Hierarchy',
        width: 300,
        cellRendererParams: {
            suppressCount: true,
        },
    },
    onCellValueChanged: params => {
        if (params.column.colId === 'cost') {
            let nodesToUpdate = [];
            recursivelyUpdateChildren(params.node.childrenMapped, params.newValue - params.oldValue, nodesToUpdate);
            gridOptions.api.updateRowData({
                update: nodesToUpdate
            })
        }
    }
};

function recursivelyUpdateChildren(childrenMapped, amount, nodesToUpdate) {
    let keys = Object.keys(childrenMapped);
    if (keys.length == 0) {
        return;
    }
    let amountToIncreaseEachChild = amount / keys.length;
    keys.forEach(key => {
        let childNode = childrenMapped[key];
        let updatedChild = {
            ...childNode.data,
            orgHierarchy: [...childNode.data.orgHierarchy],
            cost: childNode.data.cost + amountToIncreaseEachChild
        };
        nodesToUpdate.push(updatedChild);
        recursivelyUpdateChildren(childNode.childrenMapped, amountToIncreaseEachChild, nodesToUpdate)
    });
}

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener('DOMContentLoaded', function() {
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});
