var normalRowData = [
    { jobTitle: 'x CEO', employmentType: 'x Permanent' },
    { jobTitle: 'x Exec. Vice President', employmentType: 'x Permanent' },
    { jobTitle: 'x Director of Operations', employmentType: 'x Permanent' },
    { jobTitle: 'x Fleet Coordinator', employmentType: 'x Permanent' },
    { jobTitle: 'x Parts Technician', employmentType: 'x Contract' },
    { jobTitle: 'x Service Technician', employmentType: 'x Contract' },
    { jobTitle: 'x Inventory Control', employmentType: 'x Permanent' },
];

var treeRowData = [
    {
        orgHierarchy: ['Erica Rogers'],
        jobTitle: 'CEO',
        employmentType: 'Permanent',
    },
    {
        orgHierarchy: ['Erica Rogers', 'Malcolm Barrett'],
        jobTitle: 'Exec. Vice President',
        employmentType: 'Permanent',
    },

    {
        orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker'],
        jobTitle: 'Director of Operations',
        employmentType: 'Permanent',
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Esther Baker',
            'Brittany Hanson',
        ],
        jobTitle: 'Fleet Coordinator',
        employmentType: 'Permanent',
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Esther Baker',
            'Brittany Hanson',
            'Leah Flowers',
        ],
        jobTitle: 'Parts Technician',
        employmentType: 'Contract',
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
];

var columnDefsTop = [
    {
        headerName: 'Group',
        cellRenderer: 'agGroupCellRenderer',
        width: 250,
        showRowGroup: true,
        pinned: 'left',
    },
    {
        headerName: 'Group1',
        // headerGroupComponent: 'customHeaderGroupComponent',
        children: [
            { field: 'jobTitle' },
            { field: 'employmentType' },
            { field: 'employmentType' },
        ],
    },
];

var columnDefsBottom = [
    {
        headerName: 'Group',
        cellRenderer: 'agGroupCellRenderer',
        width: 250,
        showRowGroup: true,
        pinned: 'left',
    },
    {
        headerName: 'Group1',
        // headerGroupComponent: 'customHeaderGroupComponent',
        children: [{ field: 'jobTitle' }, { field: 'employmentType' }],
    },
];

// this is the grid options for the top grid
var gridOptionsTop = {
    columnDefs: columnDefsTop,
    rowData: normalRowData,
    // components: {
    //     customHeaderGroupComponent: CustomHeaderGroup
    // },
    enableColResize: true,
    groupSuppressAutoColumn: true,
    alignedGrids: [],
};

// this is the grid options for the bottom grid
var gridOptionsBottom = {
    columnDefs: columnDefsBottom,
    rowData: treeRowData,
    treeData: true,
    getDataPath: data => data.orgHierarchy,
    groupDefaultExpanded: -1, // expand all groups by default
    // components: {
    //     customHeaderGroupComponent: CustomHeaderGroup
    // },
    enableColResize: true,
    groupSuppressAutoColumn: true,
    alignedGrids: [],
    onFirstDataRendered: params => resizeBottomColGroups(params)
};

gridOptionsTop.alignedGrids.push(gridOptionsBottom);
gridOptionsBottom.alignedGrids.push(gridOptionsTop);

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDivTop = document.querySelector('#myGridTop');
    new agGrid.Grid(gridDivTop, gridOptionsTop);

    var gridDivBottom = document.querySelector('#myGridBottom');
    new agGrid.Grid(gridDivBottom, gridOptionsBottom);
});


function resizeBottomColGroups(params) {
    let allDisplayedColumnGroupsTop = gridOptionsTop.columnApi.getAllDisplayedColumnGroups();
    let topGroupOneChildren = allDisplayedColumnGroupsTop[1].displayedChildren;
    let topGroupOneChildTotalWidth = topGroupOneChildren.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;
    console.log(topGroupOneChildTotalWidth)

    let allDisplayedColumnGroupsBottom = gridOptionsBottom.columnApi.getAllDisplayedColumnGroups();
    let bottomGroupOneChildren = allDisplayedColumnGroupsBottom[1].displayedChildren;
    let newWidth = topGroupOneChildTotalWidth / bottomGroupOneChildren.length;
    console.log(newWidth)
    bottomGroupOneChildren.forEach(col => {
        gridOptionsBottom.columnApi.setColumnWidth(col, newWidth)
    })
}