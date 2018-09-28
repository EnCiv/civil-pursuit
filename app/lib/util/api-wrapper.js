'use strict';

//
// apiWrapper is a collection of functions used by the socket.io based api 
// each api call, will used these funtions to:
//  1) send the api message from the client to the server over socke.emit
//  2) queue the api message on the client if the users has not logged in yet (in the case of pushing data)
//  3) call the actual function without going through the socket if running if client code is being run on the server side
//

function apiWrapperPush(message,cb){
    if(typeof window !== undefined){
        // rendering in the browser
        let storage=window.localStorage;
        let json=storage.getItem("queue");
        let queue=json ? JSON.parse(json) : [];

        if(this && this.props && this.props.user)
            cb ? window.socket.emit(...message, cb) : window.socket.emit(...message); // don't send the call back if their isn't one
        else {
            if(cb) console.info("apiWrapperPush: queueing message, cb won't get called", message, cb);
            queue.push(message); // pushed without call back
            storage.setItem("queue", JSON.stringify(queue))
        }
    } else {
        // rendering on the server
        console.info("apiWrapper Push from server side", message)
        ;
    }
}

function apiWrapperFlush(cb) {
    if(typeof window!== 'undefined' && this && this.props && this.props.user) {
        let message;
        let storage=window.localStorage;
        let json=storage.getItem("queue");
        if(!json) return cb();
        let queue=json ? JSON.parse(json) : [];
        if(!queue.length) { 
            storage.removeItem("queue");
            return cb();
        }

        var sent=0;
        while(message=queue.shift()){
            ++sent;
            window.socket.emit(...message,()=>(--sent===0 && queue.length===0 && cb()));  // if sent is still positive or queue still has items in it, don't do anything, otherwise call the call back
        }
    } else {
        cb();
    }
}

function apiWrapperImmediate(message,cb){
    if(typeof window !== undefined){
        // rendering in the browser
            window.socket.emit(...message,cb);
    } else {
        // rendering on the server
        console.info("apiWrapper Push from server side", message)
        ;
    }
}
module.exports.apiWrapperPush=apiWrapperPush;
module.exports.apiWrapperFlush=apiWrapperFlush;
module.exports.apiWrapperImmediate=apiWrapperImmediate;

var apiWrapper={
    Push: apiWrapperPush,
    Flush: apiWrapperFlush,
    Immediate: apiWrapperImmediate
}

export default apiWrapper;

