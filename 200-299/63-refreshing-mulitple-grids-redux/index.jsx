import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';

import store from './store.jsx';
import Grid from './grid.jsx';

render(
  <Provider store={store}>
    <Grid/>
  </Provider>,
  document.getElementById('root')
);