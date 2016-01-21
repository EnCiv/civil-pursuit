'use strict';

import React from 'react';
import App from '../components/app';

window.socket = io();

window.socket.on('welcome', user => {
  render(Object.assign({}, reactProps, { user }));
});

function render (props) {
  console.log('Rendering app', props);
  React.render(<App { ...props } />, document.getElementById('synapp'));
}

render(reactProps);
