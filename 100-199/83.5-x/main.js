var state = {
    columnDefs: [
        { headerName: 'Country', field: 'country', enableRowGroup: true, rowGroup: true, rowGroupIndex: 0, hide: true },
        { headerName: 'Sport', field: 'sport', enableRowGroup: true, rowGroup: true, rowGroupIndex: 1, hide: true },
        { headerName: 'Year', field: 'year', enableRowGroup: true, rowGroup: true, rowGroupIndex: 2, hide: true },
        { headerName: 'Age', field: 'age', enableRowGroup: true, rowGroup: true, rowGroupIndex: 3, hide: true },
        { headerName: 'Gold', field: 'gold', aggFunc: 'sum' },
        { headerName: 'Silver', field: 'silver', aggFunc: 'sum' },
        { headerName: 'Bronze', field: 'bronze', aggFunc: 'sum' },
        { headerName: 'Total', field: 'total', aggFunc: 'sum' }
    ],
    rowData: null,
    idSequence: 0
}

const debouncedPostSort = debounce(postSort, 300);

function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function postSort(params) {
    console.log('postSort', params);
}


var gridOptions = {
    columnDefs: state.columnDefs,
    defaultColDef: {
        width: 150,
    },
    autoGroupColumnDef: {
        width: 300,
        cellRendererParams: {
            suppressCount: true
        }
    },
    rowData: state.rowData,
    deltaColumnMode: true,
    deltaRowDataMode: true,
    getRowNodeId: data => data.id,
    isFullWidthCell: node => !node.group && node.data.isWarning,
    fullWidthCellRenderer: 'fullWidthCellRenderer',
    components: {
        fullWidthCellRenderer: FullWidthCellRenderer
    },
    groupDefaultExpanded: 3,
    getRowStyle: params => {
        if (params.data && params.data.isHeaderRow) {
            return { backgroundColor: '#f5f7f7', color: 'rgba(0, 0, 0, 0.54)', fontWeight: 600 }
        }
    },
    onFirstDataRendered: params => {
        // const customHeaderRow = { country: 'United States', sport: 'Swimming', gold: 'Gold', silver: 'Silver', bronze: 'Bronze', total: 'Total', isHeaderRow: true, id: state.idSequence++ };
        // addSpecialRow(customHeaderRow)
        params.api.sizeColumnsToFit();
    },
    suppressAggFuncInHeader: true,
    postSort: debouncedPostSort
};

document.addEventListener('DOMContentLoaded', function () {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
    agGrid
        .simpleHttpRequest({
            url:
                'https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/olympicWinnersSmall.json',
        })
        .then(function (data) {
            let rowData = data
                .filter(row => row.country === 'United States' && row.sport === 'Swimming' && row.year === 2008 && (row.age === 23 || row.age === 24))
                .map(row => ({
                    ...row,
                    isWarning: false,
                    isHeaderRow: false,
                    id: state.idSequence++
                }));
            rowData.push({ country: 'United States', sport: 'Swimming', gold: 'Gold', silver: 'Silver', bronze: 'Bronze', total: 'Total', isHeaderRow: true, id: state.idSequence++ });
            state.rowData = rowData;
            gridOptions.api.setRowData(state.rowData);
        });
});

let warningAdded = false;
function addWarning() {
    if (warningAdded) {
        alert('warning already added');
        return;
    }
    const warningRow = { country: 'United States', sport: 'Swimming', text: 'This product has been denied for certain facilities and/or configurations', isWarning: true, id: state.idSequence++ };
    // addSpecialRow(warningRow);
    const updatedRowData = state.rowData.map(row => ({ ...row }));
    updatedRowData.push(warningRow);
    state.rowData = updatedRowData;
    gridOptions.api.setRowData(state.rowData);
    warningAdded = true;
}

function removeWarning() {
    const updatedRowData = state.rowData.filter(row => !row.isWarning);
    state.rowData = updatedRowData;
    gridOptions.api.setRowData(state.rowData);
    warningAdded = false;
}

function addSpecialRow(specialRow) {
    // there is currently no easy way to insert a row at a specified index while grouping is active

    // remove grouping 
    let updatedColDefs = state.columnDefs.map(colDef => ({
        ...colDef,
        rowGroup: false
    }));
    state.columnDefs = updatedColDefs;
    gridOptions.api.setColumnDefs(state.columnDefs);

    // add new rows at specified index - 0 since we want the custom rows to appear first in the grouping
    const updatedRowData = state.rowData.map(row => ({ ...row }));
    updatedRowData.unshift(specialRow);
    state.rowData = updatedRowData;
    gridOptions.api.setRowData(state.rowData);

    // regroup the rows
    updatedColDefs = state.columnDefs.map(colDef => ({
        ...colDef,
        rowGroup: colDef.field === 'country' || colDef.field === 'age' || colDef.field === 'sport' || colDef.field === 'year'
    }));
    state.columnDefs = updatedColDefs;
    gridOptions.api.setColumnDefs(state.columnDefs);

    // resize columns
    gridOptions.api.sizeColumnsToFit();
}

function FullWidthCellRenderer() { }

FullWidthCellRenderer.prototype.init = function (params) {
    this.eGui = document.createElement('div');
    this.eGui.style.cssText = 'padding: 0 15px; background: aquamarine; height: 100%; display: flex; align-items: center'
    this.eGui.innerHTML = `<p><i class="fas fa-exclamation" style="color: red"></i> ${params.data.text}</p>`;
}

FullWidthCellRenderer.prototype.getGui = function () {
    return this.eGui;
}