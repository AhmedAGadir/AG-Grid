import {createStore, applyMiddleware} from 'redux';
import { combinedReducer } from './reducers/index.jsx';
import logger from "./middleware/logger.jsx";

export default createStore(combinedReducer, applyMiddleware(logger));