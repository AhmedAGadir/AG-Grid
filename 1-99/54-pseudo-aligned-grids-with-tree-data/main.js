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
        headerName: 'Group3',
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
        if (!finished) {
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
    // onFirstDataRendered: resizeBottomColGroups,
    onBodyScroll: scrollTopGrid,
    onColumnResized: ({ columns, finished }) => {
        if (!finished) {
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

function scrollBottomGrid() {
    let topHScrollPos = gridOptionsTop.api.gridPanel.getHScrollPosition();
    gridOptionsBottom.api.gridPanel.setHorizontalScrollPosition(topHScrollPos.left)
}

function scrollTopGrid() {
    let bottomHScrollPos = gridOptionsBottom.api.gridPanel.getHScrollPosition();
    gridOptionsTop.api.gridPanel.setHorizontalScrollPosition(bottomHScrollPos.left)
}

function resizeBottomGrid(columns) {
    const topColGroupWidth =
        columns.length > 1  // columns.length > 1 when a column group is being resized
            ? columns.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth, })).actualWidth
            : columns[0].parent.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth, })).actualWidth;

    const topColGroupId = columns[0].parent.groupId;
    const bottomColGroup = gridOptionsBottom.columnApi.getColumnGroup(topColGroupId);
    const bottomColGroupWidth = bottomColGroup.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

    bottomColGroup.children.forEach(col => {
        const newWidth = col.actualWidth + (topColGroupWidth - bottomColGroupWidth) / bottomColGroup.children.length;
        gridOptionsBottom.columnApi.setColumnWidth(col, newWidth, true); // set finished to true to prevent inifinite loop
    });
}



function resizeTopGrid(columns) {
    const bottomColGroupWidth =
        columns.length > 1  // columns.length > 1 when a column group is being resized
            ? columns.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth
            : columns[0].parent.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

    const bottomColGroupId = columns[0].parent.groupId;
    const topColGroup = gridOptionsTop.columnApi.getColumnGroup(bottomColGroupId);
    const topColGroupWidth = topColGroup.children.reduce((a, b) => ({ actualWidth: a.actualWidth + b.actualWidth })).actualWidth;

    topColGroup.children.forEach(col => {
        const newWidth = col.actualWidth + (bottomColGroupWidth - topColGroupWidth) / topColGroup.children.length;
        gridOptionsTop.columnApi.setColumnWidth(col, newWidth, true); // set finished to true to prevent inifinite loop
    });
}