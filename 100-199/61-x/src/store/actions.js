import * as actionTypes from './actionTypes';

export const initRowData = rowData => {
    return {
        type: actionTypes.INIT_ROW_DATA,
        rowData: rowData
    }
}

export const getSortModel = (tab, rowIndex) => {
    return {
        type: actionTypes.GET_SORT_MODEL,
        tab: tab,
        rowIndex: rowIndex
    }
}

export const getFilterModel = (tab, rowIndex) => {
    return {
        type: actionTypes.GET_FILTER_MODEL,
        tab: tab,
        rowIndex: rowIndex
    }
}

export const setSortModel = (tab, sortModel) => {
    return {
        type: actionTypes.SET_SORT_MODEL,
        tab: tab,
        sortModel: sortModel
    }
}

export const setFilterModel = (tab, filterModel) => {
    return {
        type: actionTypes.SET_FILTER_MODEL,
        tab: tab,
        filterModel: filterModel
    }
}

