var columnDefs = [{ field: 'id', filter: 'agNumberColumnFilter' }];

var rowData = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

var gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    isExternalFilterPresent: () => true,
    doesExternalFilterPass: doesExternalFilterPass,
    onFirstDataRendered: onFirstDataRendered,
};

function onFirstDataRendered(params) {
    let model = {
        id: {
            filter: 2,
            filterTo: null,
            filterType: 'number',
            type: 'greaterThan',
        },
    };
    gridOptions.api.setFilterModel(model);
}

function doesExternalFilterPass(node) {
    return node.data.id % 2 === 0;
}

function getDesiredList() {

    var allNodes = [];
    gridOptions.api.forEachNode(node => allNodes.push(node));

    var filterModel = gridOptions.api.getFilterModel();
    var filterInstances = Object.keys(filterModel).map(colId => {
        return gridOptions.api.getFilterInstance(colId);
    });

    let desiredList = [];
    allNodes.forEach(node => {
        if (!filterInstances.some(filterInstance => filterInstance.doesFilterPass({ node: node, data: node.data }))) {
            desiredList.push(node);
        }
    });

    console.log(desiredList.map(node => node.data));
    return desiredList;
}

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);

    gridOptions.api.setRowData(rowData);
});
