var rowData = [
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Esther Baker',
            'Brittany Hanson',
            'Leah Flowers',
            'Tammy Sutton',
            'Derek Paul',
            'Nakia Mccaughey',
            'Corrie Lobaugh',
            'Cicely Teel',
            'Muriel Wenner',
            'Mabel Benedict',
            'Elissa Allende',
            'Irvin Brenes',
            'Minta Turck',
            'Natacha Fester',
            'Tom Woodrum',
            'Lucius Goudy'
        ],
        jobTitle: 'Director of Operations',
        employmentType: 'Permanent',
    },

    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Esther Baker',
            'Brittany Hanson',
            'Tammy Sutton',
        ],
        jobTitle: 'Service Technician',
        employmentType: 'Contract',
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Esther Baker',
            'Derek Paul',
        ],
        jobTitle: 'Inventory Control',
        employmentType: 'Permanent',
    },
]

var gridOptions = {
    columnDefs: [
        { field: 'jobTitle' },
        { field: 'employmentType' }
    ],
    autoGroupColumnDef: {
        cellRendererParams: {
            suppressCount: true
        }
    },
    rowData: rowData,
    treeData: true,
    animateRows: true,
    groupDefaultExpanded: -1,
    getDataPath: function (data) {
        return data.orgHierarchy;
    },
    onFirstDataRendered: params => params.columnApi.autoSizeAllColumns(),
    onRowGroupOpened: params => params.columnApi.autoSizeColumn('ag-Grid-AutoColumn')
};

document.addEventListener("DOMContentLoaded", function () {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.api.setRowData(rowData);
});


