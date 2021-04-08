import {types} from '../types/rowSelectedTypes.jsx'

export const rowSelectedActions = {
  rowSelected(id) {
    return {
      type: types.ROW_SELECTED,
      payload: {id}
    };
  },
  rowDeselected(id) {
    return {
      type: types.ROW_DESELECTED,
      payload: {id}
    };
  }
};