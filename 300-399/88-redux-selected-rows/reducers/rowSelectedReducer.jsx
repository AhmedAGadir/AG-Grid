import {types} from '../types/rowSelectedTypes.jsx'

const initialState = {
  selectedRows: [2, 6]
}

export default function rowSelectedReducer(state = initialState, action) {
  const payload = action.payload;
  switch (action.type) {
    case types.ROW_SELECTED:
      return {
        ...state,
        selectedRows: [...state.selectedRows, payload.id]
      };
    case types.ROW_DESELECTED:
      return {
        ...state,
        selectedRows: state.selectedRows.filter(id => id !== payload.id)
      };
    default:
      return state;
  }
}