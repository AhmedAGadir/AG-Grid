import * as actionTypes from './actionTypes';

const initialState = {
    values: [1, 2, 3, 4, 5]
}

const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_LIST_VALS:
            return {
                ...prevState,
                values: action.arr
            }
        default:
            return {
                ...prevState
            }
    }
}

export default reducer;
