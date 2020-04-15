var rowData = [
  {
    orgHierarchy: ['Erica Rogers'],
    jobTitle: 'CEO',
    employmentType: 'Permanent',
    salary: 200000
  },
  {
    orgHierarchy: ['Erica Rogers', 'Malcolm Barrett'],
    jobTitle: 'Exec. Vice President',
    employmentType: 'Permanent',
    salary: 150000
  },

  {
    orgHierarchy: ['Erica Rogers', 'Malcolm Barrett', 'Esther Baker'],
    jobTitle: 'Director of Operations',
    employmentType: 'Permanent',
    salary: 100000
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
    salary: 80000
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
    salary: 80000
  },
];

var gridOptions = {
  columnDefs: [
    { 
      headerName: 'Level',
      cellRenderer: params => 'level ' + params.node.level,
      flex: 1
    },
    {
      headerName: 'Organisation Hierarchy',
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: {
        suppressCount: true,
      },
      editable: true,
      valueGetter: params => {
      // level 0 - field: orgHierarchy
      // level 1 - field: Job Title
      // level 2 - field: Employment Type
      // level 3 - field: salary
      let orgHierarchy = params.data.orgHierarchy;
      let jobTitle = params.data.jobTitle;
      let employmentType = params.data.employmentType;
      let salary = params.data.salary;

        switch (params.node.level) {
          case 0: return orgHierarchy;
          case 1: return jobTitle;
          case 2: return employmentType;
          case 3: return salary;
          default: return null
        }
      },
      valueSetter: params => {
        switch (params.node.level) {
          case 0: {
            params.api.forEachNode(node => node.data.orgHierarchy[0] = params.newValue);
            break;
          };
          case 1: 
            params.data.jobTitle = params.newValue;
            break;
          case 2: 
            params.data.employmentType = params.newValue;
            break;
          case 3: 
            params.data.salary = Number(params.newValue);
            break;
          default: return false;
        }
        return true;
      },
      flex: 3
    },
  ],
  rowData: rowData,
  treeData: true, // enable Tree Data mode
  animateRows: true,
  groupDefaultExpanded: -1, // expand all groups by default
  getDataPath: function(data) {
    return data.orgHierarchy;
  },
  groupSuppressAutoColumn: true,
};

// wait for the document to be loaded, otherwise
// ag-Grid will not find the div in the document.
document.addEventListener('DOMContentLoaded', function() {
  // lookup the container we want the Grid to use
  var eGridDiv = document.querySelector('#myGrid');

  // create the grid passing in the div to use together with the columns & data we want to use
  new agGrid.Grid(eGridDiv, gridOptions);
});

function logRows() {
  let rows = [];
  gridOptions.api.forEachNode(node => rows.push(node.data));
  console.log(rows);
}
