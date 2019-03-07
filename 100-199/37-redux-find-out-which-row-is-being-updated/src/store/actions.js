import * as actionTypes from './actionTypes';

export const initRowData = rowData => {
    return {
        type: actionTypes.INIT_ROW_DATA,
        rowData: rowData
    }
}

export const updateRows = (min, max) => {
    return {
        type: actionTypes.UPDATE_ROWS,
        min: min,
        max: max
    }
}