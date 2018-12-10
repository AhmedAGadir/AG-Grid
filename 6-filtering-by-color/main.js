 var columnDefs = [
  {
    headerName: 'Name', 
    field: 'name'
  },
  {
    headerName: 'Score', 
    field: 'score',
    valueFormatter: params => '',
    valueGetter: transformToColor,
    cellClassRules: {
      'green': params => params.value === 'green',
      'yellow': params => params.value === 'yellow',
      'red': params => params.value === 'red'
    },
    filter: 'agSetColumnFilter',
    filterParams: {
       cellRenderer: renderColor,
    }
  },
]

function transformToColor(params) {
  var val = params.data.score;
  if (val >= 70) {
    return 'green';
  } else if (val > 30 && val < 70) { 
    return 'yellow';
  } else if (val <= 30) {
    return 'red';
  }
}

function renderColor(params) {
  var val = params.value
  switch (val) {
    case 'green': return '<div class="green">&nbsp;</div>';
    case 'yellow': return '<div class="yellow">&nbsp;</div>';
    case 'red': return '<div class="red">&nbsp;</div>';
    default: return val
  }
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
  enableFilter: true
}

document.addEventListener('DOMContentLoaded', () => {
  new agGrid.Grid(document.querySelector('#myGrid'), gridOptions)
})
