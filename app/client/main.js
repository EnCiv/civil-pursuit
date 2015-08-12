'use strict';

import React from 'react';
import App from '../components/app';
import { EventEmitter } from 'events';

let props         =   {
  online          :   0,
  path            :   location.pathname,
  user            :   null,
  ready           :   false,
  intro           :   window.synapp.intro,
  newItem         :   null
};

function render () {
  console.info('Rendering app', props);
  React.render(<App { ...props } />, document.getElementById('synapp'));
}

window.Dispatcher = new EventEmitter();

window.Dispatcher

  .on('new item', (item, panel) => {
    console.log('new item', { item, panel });
    props.newItem = { item, panel };
    render();
  })

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
