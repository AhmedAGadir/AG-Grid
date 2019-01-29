function jumpToIndex(index) {
  window.addEventListener('rowLoaded', function rowLoadedHandler() {
    let lastDisplayedRow = gridOptions.api.getLastDisplayedRow();

    if (lastDisplayedRow >= index) {
      window.removeEventListener('rowLoaded', rowLoadedHandler);

      if (gridOptions.api.getDisplayedRowAtIndex(index).data) {
        gridOptions.api.ensureIndexVisible(index, 'bottom');
      } else {
        jumpToIndex(index);
      }
    } else {
      jumpToIndex(index);
    }
  });
  gridOptions.api.ensureIndexVisible(index, 'bottom');
}

var columnDefs = [
  { field: 'id' },
  {
    field: 'athlete',
    width: 250,
    autoHeight: true,
    cellClass: 'cell-wrap-text',
  },
];

var gridOptions = {
  onGridReady: params => {
    params.api.addEventListener('modelUpdated', function(params) {
      let cacheBlockState = gridOptions.api.getCacheBlockState();

      for (row in cacheBlockState) {
        if (cacheBlockState[row].pageStatus === 'loaded');
        
        var evt = new CustomEvent('rowLoaded');
        window.dispatchEvent(evt)
        
      }
    });
    gridOptions = gridOptions; // for debugging
  },
  defaultColDef: {
    width: 120,
  },
  columnDefs: columnDefs,

  // use the server-side row model
  rowModelType: 'serverSide',

  // fetch 100 rows per at a time
  cacheBlockSize: 1000,

  // only keep 10 blocks of rows
  maxBlocksInCache: 10,

  blockLoadDebounceMillis: 500,

  enableColResize: true,
  animateRows: true,
  // debug: true,
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url:
        'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinners.json',
    })
    .then(function(data) {
      // add id to data
      var idSequence = 0;
      data.forEach(function(item) {
        item.id = idSequence++;
      });

      var server = new FakeServer(data);
      var datasource = new ServerSideDatasource(server);
      gridOptions.api.setServerSideDatasource(datasource);
    });
});

function alterRowHeights(rows) {
  return rows.map((row, ind) => {
    if (ind % 5 === 0) {
      return {
        ...row,
        athlete:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil velit eos maiores reprehenderit, minima perspiciatis totam ad asperiores deleniti facere blanditiis neque adipisci ea. Quod reprehenderit repellat odit voluptatibus similique.',
      };
    } else {
      return row;
    }
  });
}

function ServerSideDatasource(server) {
  return {
    getRows(params) {
      // adding delay to simulate real sever call
      setTimeout(function() {
        var response = server.getResponse(params.request);

        if (response.success) {
          // call the success callback
          let alteredRows = alterRowHeights(response.rows);
          params.successCallback(alteredRows, response.lastRow);
        } else {
          // inform the grid request failed
          params.failCallback();
        }
      }, 500);
    },
  };
}

function FakeServer(allData) {
  return {
    getResponse(request) {
      console.log(
        'asking for rows: ' + request.startRow + ' to ' + request.endRow
      );

      // take a slice of the total rows
      var rowsThisPage = allData.slice(request.startRow, request.endRow);

      // you need to find out the index of the last row
      // note: to make sure there arent too many calls at once, a debounce has been included in gridOptions
      var lastRow = allData.length - 1;

      return {
        success: true,
        rows: rowsThisPage,
        lastRow: lastRow,
      };
    },
  };
}


function jump() {
  let index = Number(document.querySelector('input').value);
  if (index) {
    jumpToIndex(index);
  }
}

let inputField = document.querySelector('input');
inputField.addEventListener('keydown', function(e){

if(e.keyCode === 13){
  jump();
}

})


