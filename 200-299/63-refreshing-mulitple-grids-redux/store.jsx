import {createStore, applyMiddleware} from 'redux';
import motorReducer from './reducers/motorReducer.jsx';

const initialState = {
  motor: [
      { id : 1, name : "A motor", rating: "220 V", minLoad: 5 , maxLoad : 10, normLoad : 7 },
      { id : 2, name : "B motor", rating: "210 V", minLoad: 1 , maxLoad : 10, normLoad : 5 },
      { id : 3, name : "C motor", rating: "200 V", minLoad: 1 , maxLoad : 8, normLoad : 4 },
      { id : 4, name : "D motor", rating: "150 V", minLoad: 2 , maxLoad : 5, normLoad : 2.5 },
      { id : 5, name : "E motor", rating: "440 V", minLoad: 1 , maxLoad : 100, normLoad : 40 },
      { id : 6, name : "F motor", rating: "450 V", minLoad: 1 , maxLoad : 110, normLoad : 45 },
      { id : 7, name : "G motor", rating: "1000 V", minLoad: 1 , maxLoad : 1000, normLoad : 750 },
  ]
};

export default createStore(motorReducer, initialState);