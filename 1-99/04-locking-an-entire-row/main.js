const columnDefs = [
  {headerName: 'Description', field: 'description'},
  {headerName: 'Foo', field: 'foo'},
  {headerName: 'Bar', field: 'bar'}
]

const rowData = [
  {description: 'This row is always editable', foo: 1, bar: 'text1', id:'a'},
  {description: 'This row is sometimes editable', foo: 2, bar: 'text2', id:'b'},
  {description: 'This row is always editable', foo: 3, bar: 'text3', id:'c'},
]

const gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  domLayout: 'autoHeight',
  getRowNodeId: (data) => data.id,
  defaultColDef: {
    editable: params => (params.node.id === 'b') ? toggle : true 
  },
  onFirstDataRendered: (params)=>{
    params.api.sizeColumnsToFit()
  },
  getRowStyle: params => {
    if (params.node.id === 'b') {
      return toggle ? null : {background: 'yellow'} 
    }
  }
}

let toggle = true;
function lockRowTwo() {
  toggle = !toggle;
  console.log('row 2 is', toggle ? 'unlocked' : 'locked');
  let rowNode = gridOptions.api.getRowNode('b');
  gridOptions.api.redrawRows({rowNodes: [rowNode]});
  return toggle
}

document.addEventListener('DOMContentLoaded', () => {
  const divGrid = document.querySelector('#myGrid');
  new agGrid.Grid(divGrid, gridOptions);
})
 
