import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Reducer from "./reducer.js";

const store = createStore(
  Reducer,
  compose(
    applyMiddleware(thunk)
  )
);

export default store;
