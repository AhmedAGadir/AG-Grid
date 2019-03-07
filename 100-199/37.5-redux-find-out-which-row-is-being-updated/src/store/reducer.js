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
        case actionTypes.UPDATE_ROWS:
            const updatedRowData = prevState.rowData.map((row, ind) => ({
                ...row,
                age: ind >= action.min && ind < action.max ? row.age + 1 : row.age,
                updates: ind >= action.min && ind < action.max ? row.updates + 1 : row.updates
            }));
            return {
                ...prevState,
                rowData: updatedRowData,
            }
        default: return prevState;
    }
}

export default reducer