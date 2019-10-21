import * as actionTypes from './actionTypes';

export const initRowData = () => {
    return {
        type: actionTypes.INIT_ROW_DATA,
    }
}

export const setSortModel = (rowIndex, tab, sortModel) => {
    return {
        type: actionTypes.SET_SORT_MODEL,
        rowIndex,
        tab,
        sortModel
    }
}

export const setFilterModel = (rowIndex, tab, filterModel) => {
    return {
        type: actionTypes.SET_FILTER_MODEL,
        rowIndex,
        tab,
        filterModel
    }
}

