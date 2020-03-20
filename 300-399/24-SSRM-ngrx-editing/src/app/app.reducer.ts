import { createReducer, on } from '@ngrx/store';
import { saveRows, replaceRow } from './app.actions';

export const initialState = {
  rows: []
};

const _appReducer = createReducer(initialState,
  on(saveRows, (state, {rows: rowsToAdd}) => {
    let rowsCopy = state.rows.map(row => ({...row}));
    let rowsToAddCopy = rowsToAdd.map(row => ({...row}));
    console.log('saved rows', [...rowsCopy, ...rowsToAddCopy])
    return {
      rows: [...rowsCopy, ...rowsToAddCopy]
    }
  }),
  on(replaceRow, (state, {id, field, value}) => {
    let updatedRows = state.rows.map(row => {
      if (row.id == id) {
        return {...row, [field]: value};
      } else {
        return {...row};
      }
    });
    console.log('updatedRows', updatedRows)
    return {
      rows: updatedRows
    }
  })
);

export function appReducer(state, action) {
  return _appReducer(state, action);
}



