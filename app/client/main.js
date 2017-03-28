'use strict';

import React              from 'react';
import ReactDOM			  from 'react-dom';
import App                from '../components/app';
import Facebook           from '../lib/app/fb-sdk';
import log4js                   from 'log4js';
import log4js_extend            from 'log4js-extend';




log4js.loadAppender("console");
log4js.addAppender(log4js.appenders.console());




//log4js.loadAppender(''); 
//log4js.addAppender(log4js.appenders.stdout()); 
/*
log4js.replaceConsole();
log4js.configure({
  appenders: [
    { type: "stdout" }
  ],
  replaceConsole: true
});
*/
/*log4js_extend(log4js, {
  path: __dirname,
  format: "{at:{n:@name,f:@file,l:@line.@column}}"
});
*/

if(!window.logger) window.logger = log4js.getLogger(); else console.log("window.logger already defined");


window.socket = io();

window.socket.on('welcome', user => {
  if ( ! user ) {
    new Facebook().on('ready', () => Facebook.connect(false));
  }
  render(Object.assign({}, reactProps, { user }));
});

function render (props) {
  console.log('Rendering app', props);
  logger.info({props});
  ReactDOM.render(<App { ...props } />, document.getElementById('synapp'));
}

render(reactProps);
