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
        case actionTypes.UPDATE_RAND_ROW:
            // const randIndex = Math.floor(Math.random() * prevState.rowData.length);
            const updatedRowData = prevState.rowData.map(row => ({ ...row }));
            updatedRowData[0].athlete = 'Bob';
            return {
                ...prevState,
                rowData: updatedRowData
            }
        default: return prevState;
    }
}

export default reducer