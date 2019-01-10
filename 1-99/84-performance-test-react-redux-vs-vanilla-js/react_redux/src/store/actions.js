import * as actionTypes from './actionTypes';

export const update1Row = row => {
    return {
        type: actionTypes.UPDATE_1_ROW,
        payload: row
    }
}

export const add1Row = row => {
    return {
        type: actionTypes.ADD_1_ROW,
        payload: row
    }
}

export const delete1Row = row => {
    return {
        type: actionTypes.DELETE_1_ROW,
        payload: row
    }
}

export const update100Rows = rows => {
    return {
        type: actionTypes.UPDATE_100_ROWS,
        payload: rows
    }
}

export const add100Rows = rows => {
    return {
        type: actionTypes.ADD_100_ROWS,
        payload: rows
    }
}

export const delete100Rows = rows => {
    return {
        type: 'DELETE_100_ROWS',
        payload: rows
    }
}