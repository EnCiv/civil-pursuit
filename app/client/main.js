'use strict';

import React              from 'react';
import ReactDOM			  from 'react-dom';
import App                from '../components/app';
import Facebook           from '../lib/app/fb-sdk';

window.socket = io();

window.socket.on('welcome', user => {
  if ( ! user ) {
    new Facebook().on('ready', () => Facebook.connect(false));
  }
  render(Object.assign({}, reactProps, { user }));
});

function render (props) {
  console.log('Rendering app', props);
  ReactDOM.render(<App { ...props } />, document.getElementById('synapp'));
}

render(reactProps);
