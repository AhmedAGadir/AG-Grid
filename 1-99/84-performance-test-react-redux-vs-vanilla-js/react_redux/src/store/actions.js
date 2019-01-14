import * as actionTypes from './actionTypes';

export const initRowData = rowData => {
    return {
        type: actionTypes.INIT_ROW_DATA,
        rowData: rowData
    }
}

export const updateRows = indexArr => {
    return {
        type: actionTypes.UPDATE_ROWS,
        indexArr: indexArr
    }
}

export const deleteRows = indexArr => {
    return {
        type: actionTypes.DELETE_ROWS,
        indexArr: indexArr
    }
}

export const addRows = (indexArr, symbolArr) => {
    return {
        type: actionTypes.ADD_ROWS,
        indexArr: indexArr,
        symbolArr: symbolArr
    }
}
