import * as actionTypes from './actionTypes';

export const initRowData = rowData => {
    return {
        type: actionTypes.INIT_ROW_DATA,
        rowData: rowData
    }
}

export const updateName = (name, rowIndex) => {
    return {
        type: actionTypes.UPDATE_NAME,
        name: name,
        rowIndex: rowIndex
    }
}