import * as actionTypes from './actionTypes';

export const initRowData = rowData => {
    return {
        type: actionTypes.INIT_ROW_DATA,
        rowData: rowData
    }
}

export const toggleFloatingFilter = () => {
    return {
        type: actionTypes.TOGGLE_FLOATING_FILTER,
    }
}