console.clear() 

var columnDefs = [
  {
    headerName: 'Foo', 
    field: 'foo',
    cellRenderer: 'checkboxRenderer',
  },
  {
    headerName: 'Bar', 
    field: 'bar',
    cellRenderer: 'checkboxRenderer'
  },
  {
    headerName: 'FooBar',
    field: 'foobar',
    cellRenderer: 'checkboxRenderer'
  }
]

var rowData = [
  {foo: true, bar: false, foobar: false},
  {foo: false, bar: true, foobar: false},
  {foo: false, bar: false, foobar: true},
]

var gridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  components: {
    checkboxRenderer: CheckboxRenderer
  }
}


function CheckboxRenderer() {}

CheckboxRenderer.prototype.init = function(params) {
  this.cb = document.createElement('input');
  this.cb.type = 'checkbox';
  this.cb.checked = params.value;

  this.cb.addEventListener('change', e => this.updateRow(e, params))
}

CheckboxRenderer.prototype.getGui = function() {
  return this.cb
}

CheckboxRenderer.prototype.updateRow = function(e, params) {
    let rowData = {...params.data}
    
    Object.keys(params.data).map(key => {
      if (key === params.colDef.field) {
        rowData[key] = e.target.checked
      } else {
        rowData[key] = false;
      }
    })
    params.node.setData(rowData)
}


function checkboxRenderer(params) {
  var cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = params.value;
  return cb
}

document.addEventListener('DOMContentLoaded', () => {
  new agGrid.Grid(document.querySelector('#myGrid'), gridOptions)
})