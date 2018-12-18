 var columnDefs = [
  {
    field: 'score3',
    editable: true,
    valueSetter: params => {
      console.log('HADUKEN')
      if (params.oldValue !== params.newValue) {
        params.data.score3 = params.newValue;
        return true
      } else {
        return false 
      }
    }
  }
]

var rowData = [
  {name: 'A', score1: '10', score2: '10', score3: '10'},
  {name: 'B', score1: '100', score2: '100', score3: '100'},
  {name: 'C', score1: '1000', score2: '1000', score3: '1000'},
  {name: 'D', score1: '20', score2: '20', score3: '20'},
  {name: 'E', score1: '70', score2: '70', score3: '70'},
  {name: 'F', score1: '60', score2: '60', score3: '60'},
  {name: 'G', score1: '40', score2: '40', score3: '40'},
  {name: 'H', score1: '90', score2: '90', score3: '90'},
  {name: 'I', score1: '50', score2: '50', score3: '50'},
]

var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  enableSorting: true
}

document.addEventListener('DOMContentLoaded', () => {
  new agGrid.Grid(document.querySelector('#myGrid'), gridOptions)
})
