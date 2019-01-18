import * as actionTypes from './actionTypes';

export const initRowData = rowData => {
    return {
        type: actionTypes.INIT_ROW_DATA,
        rowData: rowData
    }
}

export const toggleFloatingFilter = (columnApi, column) => {
    return {
        type: actionTypes.TOGGLE_FLOATING_FILTER,
        columnApi: columnApi,
        column: column
    }
}