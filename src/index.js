import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import reducer from './reducers';

const devToolsRedux = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(reducer, devToolsRedux);
console.log(store.getState());

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
