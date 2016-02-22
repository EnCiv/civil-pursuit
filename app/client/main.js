'use strict';

import React              from 'react';
import App                from '../components/app';
import Facebook           from '../lib/app/fb-sdk';

let currentUser;

new Facebook()
  .on('ready', () => {
    Facebook.getLoginStatus(response => {
      if ( response.status === 'connected' ) {
        Facebook.me(me => {
          console.error(me);
          socket.emit('connect facebook user', me);
        });
      }
    });
  });

window.socket = io();

window.socket.on('welcome', user => {
  currentUser = user;
  render(Object.assign({}, reactProps, { user }));
});

function render (props) {
  console.log('Rendering app', props);
  React.render(<App { ...props } />, document.getElementById('synapp'));
}

render(reactProps);
