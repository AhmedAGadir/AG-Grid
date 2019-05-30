import * as actionTypes from './actionTypes';

const initialState = {
}

const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        // case actionTypes.INIT_ROW_DATA:
        //     return {
        //         ...prevState,
        //         rowData: action.rowData
        //     };
        default: return prevState;
    }
}

export default reducer