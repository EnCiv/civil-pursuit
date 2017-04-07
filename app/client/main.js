'use strict';

import React              from 'react';
import ReactDOM			  from 'react-dom';
import App                from '../components/app';
import Facebook           from '../lib/app/fb-sdk';

// process has to be defined before log4js is imported on the browser side.
if(typeof process === 'undefined') {
  window.process={stdout: {write: function (str) {console.log(str)}}};
  process.stdout.write("stdout installed");
}

import log4js                   from 'log4js';
import log4js_extend            from 'log4js-extend';

log4js_extend(log4js, {
  path: __dirname,
  format: "{at:{n:@name,f:@file,l:@line.@column}}"
});

if(typeof global != 'undefined' && !global.logger) {
  // running on node and logger isn't defined yet
  global.logger = log4js.getLogger('node');
  global.logger.setLevel("INFO");
  logger.info("client main running on node");
}

if(typeof window != 'undefined' && !window.logger) {
  // running on browser and logger isn't defined yet
  window.logger = log4js.getLogger('browser');
  window.logger.setLevel("INFO");
  console.info("client main running on browser");
}

window.socket = io();

window.socket.on('welcome', user => {
  if ( ! user ) {
    new Facebook().on('ready', () => Facebook.connect(false));
  }
  render(Object.assign({}, reactProps, { user }));
});

function render (props) {
  console.log('Rendering app', props);
  logger.info('Rendering app', props);
  ReactDOM.render(<App { ...props } />, document.getElementById('synapp'));
}

render(reactProps);
