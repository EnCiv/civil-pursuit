'use strict';

import React              from 'react';
import ReactDOM			  from 'react-dom';
import App                from '../components/app';
import Facebook           from '../lib/app/fb-sdk';
//import log4js_extend            from 'log4js-extend';

// process has to be defined before log4js is imported on the browser side.
if(typeof window !== 'undefined') {
  console.info("main: window.process, process",typeof window.process, typeof process ); 

  process.env.LOG4JS_CONFIG= {
                                appenders: [
                                  { type: 'bconsole' },
                                ]
                              };
  //window.process={};
  //window.process.env=process.env;
  console.log("require log4js", process.env);
  //var bconsoleAppender = require('./bconsoleappender');
  var log4js = require('log4js');


  //log4js_extend(log4js, {
  //  path: __dirname,
  //  format: "{at:{n:@name,f:@file,l:@line.@column}}"
  //});

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
