'use strict';

import React              from 'react';
import App                from '../components/app';
import Facebook           from '../lib/app/fb-sdk';

new Facebook()
  .on('ready', () => {
    Facebook.getLoginStatus(response => {
      if ( response.status === 'connected' ) {
        // socket.emit('facebook user', )
        Facebook.me(me => {
          console.warn({ me });
        });
      }
    });
  });

window.socket = io();

window.socket.on('welcome', user => {
  render(Object.assign({}, reactProps, { user }));
});

function render (props) {
  console.log('Rendering app', props);
  React.render(<App { ...props } />, document.getElementById('synapp'));
}

render(reactProps);
