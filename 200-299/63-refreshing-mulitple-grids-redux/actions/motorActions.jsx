import {types} from '../types/actionTypes.jsx'

export const actions = {
  updateMinLoad(id, load) {
    return {
      type: types.UPDATE_MIN_LOAD,
      payload: { id: id, load: load }
    };
  },
  updateMaxLoad(id, load) {
    return {
      type: types.UPDATE_MAX_LOAD,
      payload: { id: id, load: load }
    };
  },
  updateNormLoad(id, load) {
    return {
      type: types.UPDATE_NORM_LOAD,
      payload: { id: id, load: load }
    };
  }
};