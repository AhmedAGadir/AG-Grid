// specify the columns
var columnDefs = [
    // we're using the auto group column by default!
    {field: "jobTitle"},
    {field: "employmentType"}
];

// specify the data
var rowData = [
    {orgHierarchy: ['Erica Rogers'], jobTitle: "CEO", employmentType: "Permanent"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett'], jobTitle: "Exec. Vice President", employmentType: "Permanent"},

    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker'], jobTitle: "Director of Operations", employmentType: "Permanent"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson'], jobTitle: "Fleet Coordinator", employmentType: "Permanent"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson', 'Leah Flowers'], jobTitle: "Parts Technician", employmentType: "Contract"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Brittany Hanson', 'Tammy Sutton'], jobTitle: "Service Technician", employmentType: "Contract"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker', 'Derek Paul'], jobTitle: "Inventory Control", employmentType: "Permanent"},

    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland'], jobTitle: "VP Sales", employmentType: "Permanent"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Morris Hanson'], jobTitle: "Sales Manager", employmentType: "Permanent"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Todd Tyler'], jobTitle: "Sales Executive", employmentType: "Contract"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Bennie Wise'], jobTitle: "Sales Executive", employmentType: "Contract"},
    {orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland', 'Joel Cooper'], jobTitle: "Sales Executive", employmentType: "Permanent"}
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
    onGridReady: function(params) {
        params.api.sizeColumnsToFit();
    },
    autoGroupColumnDef: {
        headerName: "Organisation Hierarchy",
        cellRendererParams: {
            suppressCount: true
        }
    },
    getRowStyle: params => {
        if (params.node === params.node.parent.allLeafChildren[params.node.parent.allLeafChildren.length - 1]) {
            return {borderBottom: '2px solid black'}
        }
    }
};

function onFilterTextBoxChanged() {
    gridOptions.api.setQuickFilter(document.getElementById('filter-text-box').value);
}

document.addEventListener("DOMContentLoaded", function() {
    var eGridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(eGridDiv, gridOptions);
});