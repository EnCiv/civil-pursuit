'use strict';

import React              from 'react';
import ReactDOM			  from 'react-dom';
import App                from '../components/app';
//import Facebook           from '../lib/app/fb-sdk';
import bconsole  from './bconsole';
import socketlogger from './socketlogger'


window.socket = io();
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
if(typeof window !== 'undefined') {
  if(typeof __webpack_public_path__ !== 'undefined') { // if using web pack, this will be set on the browser. Dont' set it on the server
    __webpack_public_path__ = "http://localhost:3011/assets/webpack/";
    process.env.LOG4JS_CONFIG={appenders:[]};  // webpack doesn't initialize the socket logger right - so just prevent log4js from initializing loggers
    var log4js = require('log4js');
    // It seems like these 3 steps should work - but on webpack there is no logger output
    //log4js.loadAppender("bconsole",bconsole);
    //log4js.loadAppender("socketlogger",socketlogger);
    //log4js.configure({browser: [{type: 'bconsole'},{type: 'socketlogger'}]});
  }else {
    process.env.LOG4JS_CONFIG= {appenders: [{ type: 'bconsole' }, {type: 'socketlogger'}]};
    var log4js = require('log4js');
  }

  window.logger = log4js.getLogger('browser');
  window.logger.setLevel("INFO");
  logger.info("client main running on browser");
}


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

