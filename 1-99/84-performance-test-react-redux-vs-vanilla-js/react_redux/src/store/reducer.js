import * as actionTypes from './actionTypes';

const initialState = {
    rowData: null,
}

const reducer = (prevState = initialState, action) => {
    let updatedRows;
    switch (action.type) {
        case actionTypes.INIT_ROW_DATA:
            return {
                ...prevState,
                rowData: action.rowData
            };
        case actionTypes.UPDATE_ROWS:
            updatedRows = prevState.rowData.map(row => ({ ...row })); // same thing as below
            action.indexArr.forEach(ind => {
                updatedRows[ind]['age'] += Math.floor(Math.random() * 4) + 1
            })
            return {
                ...prevState,
                rowData: updatedRows
            };
        case actionTypes.DELETE_ROWS:
            updatedRows =
                prevState.rowData
                    .map(row => Object.assign({}, row)) // same thing as above
                    .filter((_, ind) => !action.indexArr.includes(ind)) // cant use splice here as array changes with each iteration
            return {
                ...prevState,
                rowData: updatedRows
            }
        case actionTypes.ADD_ROWS:
            updatedRows = prevState.rowData.map(row => Object.assign({}, row));
            action.indexArr.forEach((rowInd, ind) => {
                updatedRows.push({
                    ...updatedRows[rowInd],
                    id: action.symbolArr[ind]
                })
            })
            return {
                ...prevState,
                rowData: updatedRows
            }
        default: return prevState;
    }
}

export default reducer