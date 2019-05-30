'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Grid from './Grid.jsx';
import store from './store.js';

render(
    <Provider store={store}>
        <Grid />
    </Provider>,
    document.querySelector('#root')
);
