import store from "./store.js";

export const updateRowData = () => dispatch => {
  const state = store.getState();
  let updatedRows = state.rowData.map(row => ({
    ...row,
    age: row.id === 1 ? Math.floor(Math.random() * 10 + 5) : row.age
  }));
  console.log('dispatching', updatedRows)
  dispatch({
    type: "UPDATE_DATA",
    payload: updatedRows
  });
};