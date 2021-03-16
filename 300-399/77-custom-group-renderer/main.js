class MyGroupRenderer {
  init(params) {
    console.log('init');
    this.params = params;

    if (!params.node.group) {
      this.eGui = document.createElement('div');
      return;
    }

    this.eGui = document.createElement('div');
    this.eGui.innerHTML = `
      <div class="my-group-renderer-wrapper">
        <span class="my-renderer-open">[Open]</span>
        <span class="my-renderer-close">[Close]</span>
        <span>${params.value}</span>
      </div>    
      `;
    this.eOpen = this.eGui.querySelector('.my-renderer-open');
    this.eClose = this.eGui.querySelector('.my-renderer-close');

    this.eOpen.addEventListener('click', () => {
      params.node.setExpanded(true);
    });

    this.eClose.addEventListener('click', () => {
      params.node.setExpanded(false);
    });

    if (params.node.expanded) {
      console.log('show close');
      this.eOpen.classList.add('hide');
      this.eClose.classList.remove('hide');
    } else {
      console.log('show open');
      this.eOpen.classList.remove('hide');
      this.eClose.classList.add('hide');
    }

    this.forceRefresh = this.forceRefresh.bind(this);

    params.api.addEventListener('rowGroupOpened', this.forceRefresh);

    // styling
    // this.eGui.style.background = 'orange';
    this.eGui.style.display = 'flex';
    let eWrapper = this.eGui.querySelector('.my-group-renderer-wrapper') 
    if (params.node.allChildrenCount < 5) {
      this.eGui.style.justifyContent = 'flex-end';
      eWrapper.style.background = 'yellow';

    } else {
      this.eGui.style.justifyContent = 'flex-start';
      eWrapper.style.background = 'dodgerblue';
    }
  }
  getGui() {
    return this.eGui;
  }
  refresh(params) {
    console.log('refresh')
    return false;
  }
  destroy() {
    this.params.api.removeEventListener('rowGroupOpened', this.forceRefresh);
  }
  forceRefresh(params) {
    if (params.node === this.params.node) {
      this.params.api.refreshCells({ 
        rowNodes: [this.params.node], 
        columns: [this.params.column.getColId()],
        force: true
      })
    }
  }
}

var gridOptions = {
  columnDefs: [
    {
      field: 'athlete',
      minWidth: 150,
    },
    { field: 'age', maxWidth: 90 },
    { field: 'country', rowGroup: true, minWidth: 150 },
    { field: 'year', maxWidth: 90 },
    { field: 'date', minWidth: 150 },
    { field: 'sport', minWidth: 150 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
    { field: 'total' },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 300,
  },
  autoGroupColumnDef: {
    cellRenderer: 'myGroupRenderer',
  },
  enableRangeSelection: true,
  components: {
    myGroupRenderer: MyGroupRenderer,
  },
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url: 'https://www.ag-grid.com/example-assets/olympic-winners.json',
    })
    .then(function (data) {
      gridOptions.api.setRowData(data.slice(0, 50));
    });
});
