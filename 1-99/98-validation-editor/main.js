var columnDefs = [{
  headerName: 'A (Invalid If length !== 6)',
  field: 'a',
  width: 100,
  cellEditor: ValidationCellEditor
}, {
  headerName: 'B',
  field: 'b',
  width: 60
}, {
  headerName: 'C',
  field: 'c',
  width: 60
}];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createRowData(numRows) {
  let rowData = [];
  for (let i = 0; i < numRows; i++) {
    rowData.push({
      a: randomIntFromInterval(100000, 999999),
      b: randomIntFromInterval(0, 100),
      c: randomIntFromInterval(0, 100)
    });
  }
  return rowData;
}


var gridOptions = {
  columnDefs: columnDefs,
  rowData: createRowData(10),
  enableColResize: true,
  defaultColDef: {
    editable: true
  },
  navigateToNextCell: this.navigateToNextCell.bind(this),
  // tabToNextCell: this.tabToNextCell.bind(this),
  onGridReady: function (params) {
    params.api.sizeColumnsToFit();
    console.log('onGridReady event Called');

  },
  onRowEditingStarted: function (event) {
    console.log('onRowEditingStarted event Called');
  },
  onRowEditingStopped: function (event) {
    console.log('onRowEditingStopped  event Called');
  },
  onCellEditingStarted: function (event) {
    console.log('cellEditingStarted event Called');
  },
  onCellEditingStopped: function (event) {
    console.log('cellEditingStopped  event Called');
  },
  onCellValueChanged: function (event) {
    console.log('onCellValueChanged event Called');
  }
};

function navigateToNextCell(params) {
  console.log("navigateToNextCell is called");
}

function tabToNextCell(params) {
  //event.preventDefault();
  var previousCell = params.previousCellDef;


  // ONE WAY TO ADD LOGIC TO CALL VALIDATE LOGIC AGAIN AFTER GETTING THE CELL VALUE
  // USING PREVIOUS CELL ROW AND COLUMN INDEX AND IF VALIDATION FAILS AND CALL BELOW LOGIC TO RETURN THE SAME CELL

  // BUT AT THIS TIME WE ALREADY DESTROYED THE CELL EDITOR AND LOST VALIDATION MESSAGE & FOCUS IN INNER CELL EDITOR.
  /*  var result = {
          rowIndex: previousCell.rowIndex,
          column: previousCell.column,
          floating: previousCell.floating
      };
  
      return result;*/
  console.log("tabToNextCell is called");

}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});