import * as actionTypes from './actionTypes';

const initialState = {
    rowData: null,
}

const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_ROW_DATA:
            return {
                ...prevState,
                rowData: action.rowData
            };
        case actionTypes.UPDATE_NAME:
            let updatedRowData = prevState.rowData.map((row, ind) => ({
                ...row,
                name: ind === action.rowIndex ? action.name : row.name
            }))
            return {
                ...prevState,
                rowData: updatedRowData
            }
        default: return prevState;
    }
}

export default reducer