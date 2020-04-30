import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './components/App';
import './index.css';

import './editor'

// Enable Hot Module Replacement
// See: https://webpack.electron.build/development#hot-module-replacement
if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('app')
);
