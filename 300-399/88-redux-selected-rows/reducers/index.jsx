import { combineReducers } from 'redux';

import fileReducer from './fileReducer.jsx';
import rowSelectedReducer from './rowSelectedReducer.jsx';

export const combinedReducer = combineReducers({
  fileReducer,
  rowSelectedReducer
});
