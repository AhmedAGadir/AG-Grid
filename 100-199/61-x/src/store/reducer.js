import * as actionTypes from './actionTypes';
import { getSortModel, getFilterModel, setSortModel, setFilterModel } from './actions';

const initialState = {
    rowData: null,
}

const initRowData = (prevState, action) => ({
    ...prevState,
    rowData: action.rowData
})



const reducer = (prevState = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT_ROW_DATA: return initRowData(prevState, action);
        case actionTypes.GET_SORT_MODEL: return getSortModel(prevState, action);
        case actionTypes.GET_FILTER_MODEL: return getFilterModel(prevState, action);
        case actionTypes.SET_SORT_MODEL: return setSortModel(prevState, action);
        case actionTypes.SET_FILTER_MODEL: return setFilterModel(prevState, action)
        default: return prevState;
    }
}

export default reducer