var columnDefs = [
  {
    field: 'athlete',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: {
      style: { color: 'blue' },
    },
  },
  {
    field: 'age',
    pinnedRowCellRenderer: 'customPinnedRowRenderer',
    pinnedRowCellRendererParams: {
      style: { 'font-style': 'italic' },
    },
  },
  { field: 'country' },
  { field: 'year' },
  { field: 'date' },
  { field: 'sport' },
];

var gridOptions = {
  defaultColDef: {
    width: 200,
    sortable: true,
    filter: true,
    resizable: true,
    editable: true,
  },
  columnDefs: columnDefs,
  rowData: null,
  getRowStyle: function (params) {
    if (params.node.rowPinned) {
      return { 'font-weight': 'bold' };
    }
  },
  // no rows to pin to start with
  pinnedTopRowData: createData(3, 'Top'),
  pinnedBottomRowData: createData(3, 'Bottom'),
  components: {
    customPinnedRowRenderer: CustomPinnedRowRenderer,
  },
  rowBuffer: 0,
  enableRangeSelection: true,
  onRangeSelectionChanged: (function (params) {
    let editingRangeSelection = false;

    return (params) => {
      
      // prevent infinite loops
      if (editingRangeSelection) {
        return;
      }

      if (!params.started && params.finished) {

        let { startRow, endRow, columns } = params.api.getCellRanges()[0];

        let rowStartIndex = getRowIndex(params.api, startRow);

        let rowEndIndex = getRowIndex(params.api, endRow);

        editingRangeSelection = true;

        params.api.clearRangeSelection();
        params.api.addCellRange({
          columns,
          rowStartIndex,
          rowEndIndex,
          rowStartPinned: undefined,
          rowEndPinned: undefined,
        });

        setTimeout(() => {
          editingRangeSelection = false;
        }, 0);
      }
    };
  })(),
};

function getRowIndex(api, row) {
  const { rowIndex, rowPinned } = row;

  if (rowPinned === 'top') {
    return api.getFirstDisplayedRow();
  } else if (rowPinned === 'bottom') {
    return api.getLastDisplayedRow();
  } else {
    return rowIndex;
  }
}

function onPinnedRowTopCount() {
  var headerRowsToFloat = document.getElementById('top-row-count').value;
  var count = Number(headerRowsToFloat);
  var rows = createData(count, 'Top');
  gridOptions.api.setPinnedTopRowData(rows);
}

function onPinnedRowBottomCount() {
  var footerRowsToFloat = document.getElementById('bottom-row-count').value;
  var count = Number(footerRowsToFloat);
  var rows = createData(count, 'Bottom');
  gridOptions.api.setPinnedBottomRowData(rows);
}

function createData(count, prefix) {
  var result = [];
  for (var i = 0; i < count; i++) {
    result.push({
      athlete: prefix + ' Athlete ' + i,
      age: prefix + ' Age ' + i,
      country: prefix + ' Country ' + i,
      year: prefix + ' Year ' + i,
      date: prefix + ' Date ' + i,
      sport: prefix + ' Sport ' + i,
    });
  }
  return result;
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json',
    })
    .then(function (data) {
      gridOptions.api.setRowData(data);
    });
});
