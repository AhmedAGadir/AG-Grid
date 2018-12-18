 var columnDefs = [
  {
    headerName: 'Name', 
    field: 'name',
  },
  {
    headerName: 'Sort with Comparator', 
    field: 'score1',
    comparator: (a, b) => {
      return Number(a) - Number(b)
    }
  },
  {
    headerName: 'Sort with Value Getters',
    field: 'score2',
    valueGetter: params => Number(params.data.score2)
  }
]

var rowData = [
  {name: 'A', score1: '10', score2: '10'},
  {name: 'B', score1: '100', score2: '100'},
  {name: 'C', score1: '1000', score2: '1000'},
  {name: 'D', score1: '20', score2: '20'},
  {name: 'E', score1: '70', score2: '70'},
  {name: 'F', score1: '60', score2: '60'},
  {name: 'G', score1: '40', score2: '40'},
  {name: 'H', score1: '90', score2: '90'},
  {name: 'I', score1: '50', score2: '50'},
]

var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  enableSorting: true
}

document.addEventListener('DOMContentLoaded', () => {
  new agGrid.Grid(document.querySelector('#myGrid'), gridOptions)
})
