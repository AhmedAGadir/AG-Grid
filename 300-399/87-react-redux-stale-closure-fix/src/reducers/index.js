import language from './language';
import greetings from './greetings'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    language,
    greetings
})

export default rootReducer