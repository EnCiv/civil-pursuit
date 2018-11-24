'use strict';

import Item from "../components/item";
import React from 'react'
import ReactDOM from 'react-dom'
import bconsole  from '../client/bconsole';

if(typeof __webpack_public_path__ !== 'undefined') // if using web pack, this will be set on the browser. Dont' set it on the server
    __webpack_public_path__ = "http://localhost:3011/assets/webpack/";

window.socket = io();

// process has to be defined before log4js is imported on the browser side.
if(typeof window !== 'undefined') {
    process.env.LOG4JS_CONFIG={appenders:[]};
    var log4js = require('log4js');
    log4js.loadAppender("bconsole",bconsole);
    log4js.configure({browser: [{type: 'bconsole'}]});
  
    window.logger = log4js.getLogger('browser');
    window.logger.setLevel("INFO");
    logger.info("logger running on browser");
  }

const testType={
    "_id": "56ce331e7957d17202e996d6",
    "name": "Intro",
    "harmony": [],
    "id": "9okDr"
}

const testItem={
    subject: "Test Item Subject",
    description: "Test Item Description\r\nTest Item Description\n\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\nTest Item Description\n",
    image: "https://res.cloudinary.com/hscbexf6a/image/upload/v1541640886/bscrv39ejmopxcur6xzu.jpg",
}

const emptyItem={type: testType}


class Test extends React.Component{
    render(){
        return(<Item RASPRoot={'/vtest/'} item={emptyItem} type={testType} className="whole-border" visualMethod= "edit" rasp={{shape: 'edit'}} />)
    }
}

ReactDOM.render(
    <Test />,
    document.getElementById('vtest')
);

export default Test;
