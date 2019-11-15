import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import makeServer from './mirage/server';

// import { Polly } from '@pollyjs/core';
// import FetchAdapter from '@pollyjs/adapter-fetch';
// import LocalStoragePersister from '@pollyjs/persister-local-storage';

// makeServer();

// Polly.register(FetchAdapter);
// Polly.register(LocalStoragePersister);

// new Polly('GigData', {
//   adapters: ['fetch'],
//   persister: 'local-storage'
// });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
