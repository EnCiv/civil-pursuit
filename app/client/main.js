'use strict';

import React              from 'react';
import ReactDOM			  from 'react-dom';
import App                from '../components/app';
//import Facebook           from '../lib/app/fb-sdk';
import bconsole  from './bconsole';
import socketlogger from './socketlogger'
import IdleTracker from 'idle-tracker'

window.socket = io();
const idleTracker = new IdleTracker({timeout: 5*60*1000, onIdleCallback: payload=>{
  if(payload.idle) {
    console.info("closing socket")
    socket.close()
  }
  else {
    socket.open()
    console.info("opening socket")
  }
}})
idleTracker.start()

window.reactSetPath = (path)=>{
  ReactDOM.unmountComponentAtNode(window.reactContainer);
  reactProps.path=path;
  window.history.pushState({}, '', path);
  render(reactProps);
}

window.socket.on('welcome', user => {
  /*if ( ! user ) {
    new Facebook().on('ready', () => Facebook.connect(false));
  }*/
  render(Object.assign({}, reactProps, { user }));
});

// process has to be defined before log4js is imported on the browser side.
if(!window.process) window.process={}
if(!window.process.env) window.process.env={}
process.env.LOG4JS_CONFIG = { appenders: [] } // webpack doesn't initialize the socket logger right - so just prevent log4js from initializing loggers
var log4js = require('log4js')
if (window.socket.NoSocket) {
  log4js.configure({
    appenders: { bconsole: { type: bconsole } },
    categories: {
      default: { appenders: ['bconsole'], level: 'error' },
    },
    disableClustering: true,
  })
} else if (typeof __webpack_public_path__ !== 'undefined') {
  // if using web pack, this will be set on the browser. Dont' set it on the server
  __webpack_public_path__ = 'http://localhost:3011/assets/webpack/'
  log4js.configure({
    appenders: { bconsole: { type: bconsole }, socketlogger: { type: socketlogger } },
    categories: {
      default: { appenders: ['bconsole', 'socketlogger'], level: window.env === 'production' ? 'info' : 'trace' },
    },
    disableClustering: true,
  })
} else {
  // haven't seen this case in a while. mostly, __webpack_public_path is ''
  log4js.configure({
    appenders: { bconsole: { type: bconsole }, socketlogger: { type: socketlogger } },
    categories: {
      default: { appenders: ['bconsole', 'socketlogger'], level: window.env === 'production' ? 'info' : 'trace' },
    },
    disableClustering: true,
  })
}

window.logger = log4js.getLogger('browser')
logger.info('client main running on browser', window.location.pathname, reactProps.browserConfig)



function render (props) {
  try {
    window.reactContainer=document.getElementById('synapp');
    if(!window.Synapp) window.Synapp={};
    window.Synapp.fontSize=parseFloat(window.getComputedStyle(window.reactContainer, null).getPropertyValue('font-size'));
    ReactDOM.render(<App { ...props } />, window.reactContainer );
  }
  catch(error){
    document.getElementsByTagName('body')[0].style.backgroundColor='red';
    logger.error("render Error", error)
  }
}

function hydrate (props) {
  try {
    if(!(window.reactContainer=document.getElementById('synapp')))
      logger.error("synapp id not found");
    
    if(!window.Synapp) window.Synapp={};
    window.Synapp.fontSize=parseFloat(window.getComputedStyle(window.reactContainer, null).getPropertyValue('font-size'));
    ReactDOM.hydrate(<App { ...props } />, window.reactContainer ); // should be hydrate
  }
  catch(error){
    document.getElementsByTagName('body')[0].style.backgroundColor='red';
    logger.info("hydrate Error", error)
  }
}

hydrate(reactProps);

