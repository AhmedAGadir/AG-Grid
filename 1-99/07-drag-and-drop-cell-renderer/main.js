 var columnDefs = [
  {
    headerName: 'Name', 
    field: 'name',
    cellRenderer: myCustomCellRenderer
  },
  {
    headerName: 'Score', 
    field: 'score',
    cellRenderer: myCustomCellRenderer
  },
]

function myCustomCellRenderer(params) {
  let rowNode = params.node;
  let fieldId = params.colDef.field
  let div = document.createElement('div');
  div.textContent = params.value;
  div.draggable = true;
  div.addEventListener('dragstart', e => drag(e))
  div.addEventListener('drop', e => drop(e, rowNode, fieldId))
  div.addEventListener('dragover', e => allowDrop(e))
  return div
}

function drag(e) {
  e.dataTransfer.setData('text',e.target.textContent)
}

function drop(e, rowNode, fieldId) {
  e.preventDefault();
  var data = e.dataTransfer.getData('text')
  rowNode.setDataValue(fieldId, data)
}

function allowDrop(e) {
  e.preventDefault();
}

var rowData = [
  {name: 'A', score: '10'},
  {name: 'B', score: '30'},
  {name: 'C', score: '80'},
  {name: 'D', score: '70'},
  {name: 'E', score: '40'},
  {name: 'F', score: '60'},
  {name: 'G', score: '90'},
  {name: 'H', score: '20'},
  {name: 'I', score: '90'},
  {name: 'J', score: '20'},
  {name: 'K', score: '60'},
  {name: 'L', score: '50'},
  {name: 'M', score: '40'},
  {name: 'N', score: '90'},
  {name: 'O', score: '70'},
  {name: 'P', score: '50'}
]

var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  getRowNodeId: data => data.name,
  components: {
    myCustomCellRenderer: 'myCustomCellRenderer'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new agGrid.Grid(document.querySelector('#myGrid'), gridOptions)
})
