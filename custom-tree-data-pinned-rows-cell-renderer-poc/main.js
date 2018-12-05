// specify the columns
var columnDefs = [
    // we're using the auto group column by default!
    { field: 'jobTitle' },
    { field: 'employmentType' },
];

// specify the data
var pinnedTopRowData = [
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
];

var rowData = [
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

    {
        orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Francis Strickland'],
        jobTitle: 'VP Sales',
        employmentType: 'Permanent',
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Francis Strickland',
            'Morris Hanson',
        ],
        jobTitle: 'Sales Manager',
        employmentType: 'Permanent',
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Francis Strickland',
            'Todd Tyler',
        ],
        jobTitle: 'Sales Executive',
        employmentType: 'Contract',
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Francis Strickland',
            'Bennie Wise',
        ],
        jobTitle: 'Sales Executive',
        employmentType: 'Contract',
    },
    {
        orgHierarchy: [
            'Erica Rogers',
            'Malcolm Barrett',
            'Francis Strickland',
            'Joel Cooper',
        ],
        jobTitle: 'Sales Executive',
        employmentType: 'Permanent',
    }
];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    pinnedTopRowData: pinnedTopRowData,
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
        headerName: 'Organisation Hierarchy',
        cellRendererParams: {
            suppressCount: true,
        },
    },
    components: {
        agGroupCellRenderer: CustomGroupCellRenderer
    }
};

function onFilterTextBoxChanged() {
    gridOptions.api.setQuickFilter(
        document.getElementById('filter-text-box').value
    );
}

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener('DOMContentLoaded', function () {
    // lookup the container we want the Grid to use
    var eGridDiv = document.querySelector('#myGrid');

    // create the grid passing in the div to use together with the columns & data we want to use
    new agGrid.Grid(eGridDiv, gridOptions);

    // gridOptions.api.setPinnedTopRowData(pinnedTopRowData);
    // gridOptions.api.setRowData(rowData);
});

function CustomGroupCellRenderer() { }

CustomGroupCellRenderer.prototype.init = function (params) {
    console.log(Object.keys(params.node.childrenMapped).length)
    this.params = params;

    this.indentation = this.params.node.uiLevel

    if (params.node.isRowPinned()) {
        this.indentation = this.params.node.data.orgHierarchy.length;
        this.params.value = this.params.node.data.orgHierarchy[this.params.node.data.orgHierarchy.length - 1];
    }

    this.contracted = ''
    this.expanded = ''
    if (Object.keys(params.node.childrenMapped).length > 0) {
        this.contracted = (this.params.node.expanded) ? '<span class="ag-icon ag-icon-contracted" style="transform: translateY(2px) rotate(-90deg)"></span>' : '';
        this.expanded = (this.params.node.expanded) ? '' : '<span class="ag-icon ag-icon-expanded"></span>'
    }

    this.eGui = document.createElement('div');
    this.eGui.innerHTML = '<span class="ag-row-group-indent-' + this.indentation + '">' +
        '<span class="ag-group-expanded" ref="eExpanded">' + this.expanded + '</span>' +
        '<span class="ag-group-contracted" ref="eContracted">' + this.contracted + '</span>' +
        '<span class="ag-group-checkbox" ref="eCheckbox"></span>' +
        '<span class="ag-group-value" ref="eValue">' + this.params.value + '</span>' +
        '<span class="ag-group-child-count" ref="eChildCount"></span>' +
        '</span>'



    // this.eGui = document.createElement('span');
    // this.eGui.textContent = params.node.isRowPinned();

    // this.params = params;

    // this.eGui = document.createElement('div');
    // this.eGui.innerHTML = `
    //   <span class="open-arrow">&#8594</span><span>${params.value}</span>
    // `;

    // this.eGroupArrow = this.eGui.querySelector('.open-arrow');
    // this.eGui.addEventListener('click', this.onGroupClicked.bind(this));
}

CustomGroupCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

CustomGroupCellRenderer.prototype.onGroupClicked = function () {
    // this.params.node.setExpanded(!this.params.node.expanded);
    // if (this.params.node.expanded) {
    //     this.eGroupArrow.innerHTML = '&#8595';
    // } else {
    //     this.eGroupArrow.innerHTML = '&#8594';
    // }
}

CustomGroupCellRenderer.prototype.destroy = function () {
    // this.eGroupArrow.removeEventListener('click', this.onGroupClicked);
}