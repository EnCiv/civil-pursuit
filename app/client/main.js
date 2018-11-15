'use strict';

import React              from 'react';
import ReactDOM			  from 'react-dom';
import App                from '../components/app';
import Facebook           from '../lib/app/fb-sdk';
import bconsole  from './bconsole';
import socketlogger from './socketlogger'

if(typeof __webpack_public_path__ !== 'undefined') // if using web pack, this will be set on the browser. Dont' set it on the server
	__webpack_public_path__ = "http://localhost:3011/assets/webpack/";

window.socket = io();
window.reactSetPath = (path)=>{
  ReactDOM.unmountComponentAtNode(window.reactContainer);
  reactProps.path=path;
  window.history.pushState({}, '', path);
  render(reactProps);
}

window.socket.on('welcome', user => {
  if ( ! user ) {
    new Facebook().on('ready', () => Facebook.connect(false));
  }
  render(Object.assign({}, reactProps, { user }));
});

// process has to be defined before log4js is imported on the browser side.
if(typeof window !== 'undefined') {
  //process.env.LOG4JS_CONFIG= {appenders: [{ type: 'bconsole' }, {type: 'socketlogger'}]};
  process.env.LOG4JS_CONFIG={appenders:[]};
  var log4js = require('log4js');
  log4js.loadAppender("bconsole",bconsole);
  log4js.loadAppender("socketlogger",socketlogger);
  log4js.configure({browser: [{type: 'bconsole'},{type: 'socketlogger'}]});


//  log4js_extend(log4js, {
//    path: __dirname,
//    format: "{at:{n:@name,f:@file,l:@line.@column}}"
//  });

  window.logger = log4js.getLogger('browser');
  window.logger.setLevel("INFO");
  logger.info("client main running on browser");
}

function render (props) {
  window.reactContainer=document.getElementById('synapp');
  if(!window.Synapp) window.Synapp={};
  window.Synapp.fontSize=parseFloat(window.getComputedStyle(window.reactContainer, null).getPropertyValue('font-size'));
  console.log('Rendering app', props);
  logger.info('Rendering app', props);
  ReactDOM.hydrate(<App { ...props } />, window.reactContainer );
}

render(reactProps);
