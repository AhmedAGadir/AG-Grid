import {types} from '../types/actionTypes.jsx'

export default function motorReducer(state = {}, action) {
  const payload = action.payload;
  switch (action.type) {
    case types.UPDATE_MIN_LOAD:
       return state.motor.map((item, index) => {
          if(item.id === action.payload.id) {
            return {
              ...item,
              minLoad: action.payload.load
            }
          }
          return item;
      });
    case types.UPDATE_MAX_LOAD:
      return state.motor.map((item, index) => {
          if(item.id === action.payload.id) {
            return {
              ...item,
              maxLoad: action.payload.load
            }
          }
          return item;
      });
    case types.UPDATE_NORM_LOAD:
      return state.motor.map((item, index) => {
          if(item.id === action.payload.id) {
            return {
              ...item,
              normLoad: action.payload.load
            }
          }
          return item;
      });
    default:
      return state;
  }
}