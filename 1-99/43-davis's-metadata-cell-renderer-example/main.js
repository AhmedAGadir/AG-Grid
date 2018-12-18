// cell renderer class
class ExampleCellRenderer {
  constructor() {}

  // init method gets the details of the cell to be rendered
  init(params) {
    console.log ('init with', params)

    this.params = params;
    this.eGui = document.createElement('div');
    this.field = params.colDef.field;

    this.eGui.innerHTML = `
      <div class='firstLine '>
        <input class='editor' />
      </div>

      <div class="secondLine">
        <a class="secondary-selector">${params.data[this.field].secondary}</a> 
      </div>
      
      <div>
         <a class="tertiary-selector">${params.data[this.field].tertiary}</a>
      </div>
    `;

    this.input = this.eGui.querySelector('.editor');
    this.input.value = params.value;

    // DOM bindings
    this.eSecondary = this.eGui.querySelector('.secondary-selector');
    this.eTertiary = this.eGui.querySelector('.tertiary-selector');

    // Events bindings
    this.input.addEventListener('change', this.inputChangeHandler.bind(this));

    this.eSecondary.addEventListener('click', this.selectValue.bind(this));
    this.eTertiary.addEventListener('click', this.selectValue.bind(this));
  }

  selectValue(e) {
    console.log ('selectValue')
    e.preventDefault();
    this.selectedValue = e.target.innerText;
    let data = this.params.node.data[this.field];
    data.currentValue = e.target.innerText;
    data.valueChanged = true;

    console.log ('just before setting value')
    this.params.node.setDataValue(this.field, data);   
    console.log ('just after setting value')
  }

  getGui() {
    console.log ('getGui')
    return this.eGui;
  }
  destroy() {
    console.log ('destroy')
    this.eSecondary.removeEventListener('click', this.selectValue);
    this.eTertiary.removeEventListener('click', this.selectValue);
  }

  inputChangeHandler(e) {
    console.log ('inputChangeHandler')
    var oldData = this.params.data[this.field];

    var newData = {
      ...oldData,
      currentValue: e.target.value,
    };
    this.params.node.setDataValue(this.field, newData);
  }
}

const exampleValueGetter = params => {
  return params.data[params.colDef.field].currentValue;
};

var columnDefs = [
  {
    field: 'a',
    cellRenderer: ExampleCellRenderer,
    valueGetter: exampleValueGetter,
    cellClassRules: {
      changed: (params)=> params.data [params.colDef.field].valueChanged
    }
  },
  {
    field: 'b',
    cellRenderer: ExampleCellRenderer,
    valueGetter: exampleValueGetter,
    cellClassRules: {
      changed: (params)=>params.data.valueChanged
    }
  },
  {
    field: 'c',
    cellRenderer: ExampleCellRenderer,
    valueGetter: exampleValueGetter,
    cellClassRules: {
      changed: (params)=>params.data.valueChanged
    }
  },
];

var rowData = [
  {
    a: {
      currentValue: 'A1',
      secondary: 'AA1',
      tertiary: 'AAA1',
      valueChanged: false,
    },
    b: {
      currentValue: 'B1',
      secondary: 'BB1',
      tertiary: 'BBB1',
      valueChanged: false,
    },
    c: {
      currentValue: 'C1',
      secondary: 'CC1',
      tertiary: 'CCC1',
      valueChanged: false,
    },
  },
  {
    a: {
      currentValue: 'A2',
      secondary: 'AA2',
      tertiary: 'AAA2',
      valueChanged: false,
    },
    b: {
      currentValue: 'B2',
      secondary: 'BB2',
      tertiary: 'BBB2',
      valueChanged: false,
    },
    c: {
      currentValue: 'C2',
      secondary: 'CC2',
      tertiary: 'CCC2',
      valueChanged: false,
    },
  },
  {
    a: {
      currentValue: 'A3',
      secondary: 'AA3',
      tertiary: 'AAA3',
      valueChanged: false,
    },
    b: {
      currentValue: 'B3',
      secondary: 'BB3',
      tertiary: 'BBB3',
      valueChanged: false,
    },
    c: {
      currentValue: 'C3',
      secondary: 'CC3',
      tertiary: 'CCC3',
      valueChanged: false,
    },
  },
];

var gridOptions = {
  enableSorting: true,
  // turn on filtering
  enableFilter: true,
  defaultColDef: {},
  rowData: rowData,
  columnDefs: columnDefs,
  getRowHeight: params => {
    return 75;
  },
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
});
