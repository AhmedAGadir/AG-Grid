var rowData = [
  {
    name: 'Fo',
    form: true,
    formData: { callId: 1, phone: 0771113344, direction: 'out' },
  },
  {
    name: 'Foo',
    employees: [
      {
        name: 'qux',
      },
      {
        name: 'quux',
        form: true,
        formData: { callId: 3, phone: 0771113344, direction: 'out' },
      },
      {
        name: 'quuux',
        form: true,
        formData: { callId: 4, phone: 0771113344, direction: 'out' },
      },
    ],
  },
  {
    name: 'Fooo',
    employees: [
      {
        name: 'Baz',
        form: true,
        formData: { callId: 5, phone: 0771113344, direction: 'out' },
      },
      {
        name: 'Baaz',
        employees: [
          { name: 'Bar' },
          { name: 'Barr' },
          {
            name: 'Barrr',
            form: true,
            formData: { callId: 6, phone: 0771113344, direction: 'out' },
          },
        ],
      },
      {
        name: 'Baaaz',
        employees: [
          {
            name: 'Fred',
            form: true,
            formData: { callId: 7, phone: 0771113344, direction: 'out' },
          },
          { name: 'Fredd', employees: [{ name: 'Waldo' }] },
          { name: 'Freddd' },
        ],
      },
    ],
  },
];

var gridOptions = {
  columnDefs: [{ field: 'name', cellRenderer: 'agGroupCellRenderer' }],
  defaultColDef: {
    flex: 1,
  },
  rowData: rowData,
  masterDetail: true,
  getRowHeight: (params) => {
    var isDetailRow = params.node.detail;

    // for all rows that are not detail rows, return nothing
    if (!isDetailRow) {
      return undefined;
    }

    if (params.data.form) {
      return 70;
    } else {
      return 310;
    }
  },
  detailCellRenderer: 'myDetailCellRenderer',
  components: {
    myDetailCellRenderer: getDetailCellRenderer(),
  },
  onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
  setTimeout(function () {
    params.api.getDisplayedRowAtIndex(1).setExpanded(true);
  }, 0);
}

document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});
