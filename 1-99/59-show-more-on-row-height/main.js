var columnDefs = [
    {
        headerName: 'Make',
        field: 'make',
    },
    {
        headerName: 'Model',
        field: 'model',
        cellClass: 'cell-wrap-text',
        autoHeight: true,
        cellRenderer: 'myCustomCellRenderer'
    },
    {
        headerName: 'Price',
        field: 'price',
    }
];

var gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        width: 250,
    },
    rowData: [],
    components: {
        myCustomCellRenderer: MyCustomCellRenderer
    },
    onGridReady: () => {
        // in this example, the CSS styles are loaded AFTER the grid is created,
        // so we put this in a timeout, so height is calculated after styles are applied.
        setTimeout(function () {
            gridOptions.api.resetRowHeights();
        }, 500);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    // set initial row data 
    fetch('https://api.myjson.com/bins/15psn9')
        .then(res => res.json())
        .then(data => {

            let largeRow = {
                make: 'Audi',
                model: {
                    text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda eos officia corrupti impedit quisquam quis, eaque, quam nihil obcaecati dolores voluptatibus nam! Laborum odit molestiae in, aperiam quas consequatur deserunt!',
                    expanded: false
                },
                price: '£10000'
            }

            let rowData = data.map((d, ind) => {
                // every tenth row to be expandable
                if (ind % 10 === 0) {
                    return {
                        ...largeRow,
                    };
                } else {
                    return d;
                }
            })

            gridOptions.api.setRowData(rowData)

        })
        .catch(err => console.log(err))

});

function MyCustomCellRenderer() { }

MyCustomCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');

    // if the text length is short, then render normally
    if (params.value.length < 30) {
        this.eGui.innerHTML = params.value;
        return;
    }

    // set text length 
    this.cellText = document.createElement('div');
    if (params.value.expanded) {
        this.cellText.textContent = params.value.text;
    } else {
        this.cellText.textContent = params.value.text.substring(0, 20) + '...';
    }

    // button logic
    this.eButton = document.createElement('button');
    this.eButton.textContent = params.value.expanded ? 'show less' : 'show more';
    this.eButton.addEventListener('click', () => {
        params.node.setDataValue(params.colDef.field, {
            ...params.value,
            expanded: !params.value.expanded
        });
        params.api.Heights();
    })

    // styling and appending
    this.eGui.className = params.value.expanded ? 'custom-cell-expanded' : 'custom-cell-contracted';
    this.eGui.appendChild(this.cellText);
    this.eGui.appendChild(this.eButton);
}

MyCustomCellRenderer.prototype.getGui = function () {
    return this.eGui;
}

