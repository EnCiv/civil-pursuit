'use strict';

import React from 'react';
import App from '../components/app';

let props         =   {
  online          :   0,
  path            :   location.pathname,
  user            :   null,
  ready           :   false,
  intro           :   window.synapp.intro
};

function render () {
  console.info('Rendering app', props);
  React.render(<App { ...props } />, document.getElementById('synapp'));
}

window.socket = io();

// render();

window.socket

  .on('welcome', user => {
    props.ready = true;
    props.user = user;
    render();
  })

  .on('online users', users => {
    props.online = users;
    render();
  });
