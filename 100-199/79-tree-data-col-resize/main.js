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
            'Lucius Goudy',
            'Iluminada Baehr',
            'Sarina Kindig',
            'Tena Ranum',
            'Era Almeda',
            'Dung Orvis',
            'Andrea Delaughter',
            'Racquel Rimer',
            'Lindsay Pearl',
            'Devorah Rutten'
        ],
        jobTitle: 'Director of Operations',
        employmentType: 'Permanent',
    }
]

var gridOptions = {
    columnDefs: [
        { field: 'jobTitle' },
        { field: 'employmentType' }
    ],
    rowData: rowData,
    treeData: true,
    animateRows: true,
    groupDefaultExpanded: -1,
    getDataPath: function (data) {
        return data.orgHierarchy;
    },
    onFirstDataRendered: params => params.columnApi.autoSizeAllColumns()
};

document.addEventListener("DOMContentLoaded", function () {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
    gridOptions.api.setRowData(rowData);
});


