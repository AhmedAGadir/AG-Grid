import * as actionTypes from './actionTypes';

export const initRowData = rowData => {
    return {
        type: actionTypes.INIT_ROW_DATA,
        rowData: rowData
    }
}

export const updateRandRow = () => {
    return {
        type: actionTypes.UPDATE_RAND_ROW
    }
}