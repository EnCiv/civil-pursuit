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
  newItem         :   null,
  close           :   false,
  panel           :   {},
  topLevelType    :   null
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

  .on('open request', () => {
    console.info('open request');
    props.close = true;
    render();
    props.close = false;
  })

window.socket = io();

// render();

window.socket

  .on('welcome', user => {
    props.ready = true;
    props.user = user;
    render();

    window.socket.emit('get top level type');
  })

  .on('online users', users => {
    props.online = users;
    render();
  })

  .on('OK get top level type', type => {
    props.topLevelType = type;
    render ();

    window.socket.emit('get items', { type });
  })

  .on('OK get panel items', () => {});
