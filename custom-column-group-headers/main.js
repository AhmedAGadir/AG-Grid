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
        children: [
            { field: 'jobTitle', width: 200 },
            { field: 'employmentType', width: 400 },
        ],
    },
    {
        headerName: 'Group2',
        children: [
            { field: 'jobTitle', width: 200 },
            { field: 'employmentType', width: 200 },
        ],
    },
    {
        headerName: 'Group3',
        children: [
            { field: 'jobTitle', width: 200 },
            { field: 'employmentType', width: 200 },
            { field: 'employmentType', width: 200 },
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
        children: [
            { field: 'jobTitle', width: 200 },
            { field: 'employmentType', width: 200 },
            { field: 'employmentType', width: 200 },
        ],
    },
    {
        headerName: 'Group2',
        children: [
            { field: 'jobTitle', width: 200 },
            { field: 'employmentType', width: 200 },
        ],
    },
    {
        headerName: 'Group1',
        children: [
            { field: 'jobTitle', width: 200 },
            { field: 'employmentType', width: 400 },
        ],
    },
];

// this is the grid options for the top grid
var gridOptionsTop = {
    columnDefs: columnDefsTop,
    rowData: normalRowData,
    enableColResize: true,
    groupSuppressAutoColumn: true,
    onBodyScroll: scrollBottomGrid,
    onColumnResized: ({ columns, finished }) => {
        if (finished) {
            resizeBottomGrid(columns)
        }
    }
};

// this is the grid options for the bottom grid
var gridOptionsBottom = {
    columnDefs: columnDefsBottom,
    rowData: treeRowData,
    treeData: true,
    getDataPath: data => data.orgHierarchy,
    groupDefaultExpanded: -1, // expand all groups by default
    enableColResize: true,
    groupSuppressAutoColumn: true,
    onFirstDataRendered: resizeBottomColGroups,
    onBodyScroll: scrollTopGrid,
    onColumnResized: ({ columns, finished }) => {
        if (finished) {
            resizeTopGrid(columns)
        }
    }
};


// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    var gridDivTop = document.querySelector('#myGridTop');
    new agGrid.Grid(gridDivTop, gridOptionsTop);

    var gridDivBottom = document.querySelector('#myGridBottom');
    new agGrid.Grid(gridDivBottom, gridOptionsBottom);
});


function resizeBottomColGroups() {
    // // ************** FIX THIS **************
    // let allDisplayedColumnGroupsTop = gridOptionsTop.columnApi.getAllDisplayedColumnGroups();

    // allDisplayedColumnGroupsTop.forEach(colGroup => {

    // })

    // let topGroupOneChildren = allDisplayedColumnGroupsTop[1].displayedChildren;
    // let topGroupOneChildTotalWidth = topGroupOneChildren.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

    // let allDisplayedColumnGroupsBottom = gridOptionsBottom.columnApi.getAllDisplayedColumnGroups();
    // let bottomGroupOneChildren = allDisplayedColumnGroupsBottom[1].displayedChildren;
    // let newWidth = topGroupOneChildTotalWidth / bottomGroupOneChildren.length;
    // bottomGroupOneChildren.forEach(col => {
    //     gridOptionsBottom.columnApi.setColumnWidth(col, newWidth)
    // })
}

function scrollBottomGrid() {
    let topHScrollPos = gridOptionsTop.api.gridPanel.getHScrollPosition();
    gridOptionsBottom.api.gridPanel.setHorizontalScrollPosition(topHScrollPos.left)
}

function scrollTopGrid() {
    let bottomHScrollPos = gridOptionsBottom.api.gridPanel.getHScrollPosition();
    gridOptionsTop.api.gridPanel.setHorizontalScrollPosition(bottomHScrollPos.left)
}

function resizeBottomGrid(columns) {
    // columns.length > 1 when a column group is being resized
    let topColGroupWidth = (columns.length > 1)
        ? columns.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth
        : columns[0].parent.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;;

    let topColGroupId = columns[0].parent.groupId;

    let bottomColGroup = gridOptionsBottom.columnApi.getColumnGroup(topColGroupId);
    let bottomColGroupWidth = bottomColGroup.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

    let difference = topColGroupWidth - bottomColGroupWidth;
    bottomColGroup.children.forEach(col => {
        // set finished to false on setColumnWidth to prevent inifinite loop 
        gridOptionsBottom.columnApi.setColumnWidth(col, col.actualWidth + difference / bottomColGroup.children.length, false)
    })
}

function resizeTopGrid(columns) {
    let bottomColGroupWidth = (columns.length > 1)
        ? columns.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth
        : columns[0].parent.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

    let bottomColGroupId = columns[0].parent.groupId;

    let topColGroup = gridOptionsTop.columnApi.getColumnGroup(bottomColGroupId);
    let topColGroupWidth = topColGroup.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

    let difference = bottomColGroupWidth - topColGroupWidth;
    topColGroup.children.forEach(col => {
        // set finished to false on setColumnWidth to prevent inifinite loop 
        gridOptionsTop.columnApi.setColumnWidth(col, col.actualWidth + difference / topColGroup.children.length, false)
    })
}