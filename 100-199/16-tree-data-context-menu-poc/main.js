// specify the columns
var columnDefs = [
    // we're using the auto group column by default!
    { field: "jobTitle" },
    { field: "employmentType" }
];

// specify the data
var rowData = [
    { orgHierarchy: ['Erica Rogers'], jobTitle: "CEO", employmentType: "Permanent" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett'], jobTitle: "Exec. Vice President", employmentType: "Permanent" },

    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker'], jobTitle: "Director of Operations", employmentType: "Permanent" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson'], jobTitle: "Fleet Coordinator", employmentType: "Permanent" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson', 'Leah Flowers'], jobTitle: "Parts Technician", employmentType: "Contract" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson', 'Tammy Sutton'], jobTitle: "Service Technician", employmentType: "Contract" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Derek Paul'], jobTitle: "Inventory Control", employmentType: "Permanent" },

    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland'], jobTitle: "VP Sales", employmentType: "Permanent" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Morris Hanson'], jobTitle: "Sales Manager", employmentType: "Permanent" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Todd Tyler'], jobTitle: "Sales Executive", employmentType: "Contract" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Bennie Wise'], jobTitle: "Sales Executive", employmentType: "Contract" },
    { orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Joel Cooper'], jobTitle: "Sales Executive", employmentType: "Permanent" }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    treeData: true, // enable Tree Data mode
    animateRows: true,
    groupDefaultExpanded: -1, // expand all groups by default
    getDataPath: function (data) {
        return data.orgHierarchy;
    },
    onGridReady: function (params) {
        params.api.sizeColumnsToFit();
    },
    autoGroupColumnDef: {
        headerName: "Organisation Hierarchy",
        cellRendererParams: {
            suppressCount: true
        }
    },
    getContextMenuItems: getContextMenuItems
};

function getContextMenuItems(params) {
    var result = [
        {
            // custom item
            name: 'Add to Panel',
            action: function () {
                let li = document.createElement('li');
                li.textContent = params.value;
                document.querySelector('#panel ul').appendChild(li);
            },
        },
        {
            // custom item
            name: 'Remove from Panel',
            action: function () {
                let ul = document.querySelector('#panel ul');
                for (let i = ul.children.length - 1; i >= 0; i--) {
                    if (ul.children[i].textContent === params.value) {
                        ul.children[i].remove();
                    }
                }
            },
        },
        'separator',
        'copy',
        'copyWithHeaders',
    ];

    return result;
}

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener("DOMContentLoaded", function () {

    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);
});