import {types} from '../types/fileTypes.jsx'

export const fileActions = {
  newFile(folder) {
    return {
      type: types.NEW_FILE,
      payload: {folder}
    };
  },
  deleteFile(id) {
    return {
      type: types.DELETE_FILE,
      payload: {id}
    };
  }
};