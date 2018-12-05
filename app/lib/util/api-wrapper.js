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

function apiWrapperUpdate1OrPush(message,cb){
    // message is an array of 2, the first is a string where is the name of the operation, 
    // the second is an object to which Object.assign can be applied to update/accumulate properties to be passed in the api call when it is made
    if(typeof window !== undefined){
        // rendering in the browser
        let storage=window.localStorage;
        let json=storage.getItem("queue");
        let queue=json ? JSON.parse(json) : [];

        if(this && this.props && this.props.user)
            cb ? window.socket.emit(...message, cb) : window.socket.emit(...message); // don't send the call back if their isn't one
        else {
            if(cb) console.info("apiWrapperPush: queueing message, cb won't get called", message, cb);
            let l=queue.length;
            if(l && queue[l-1][0]===message[0]){
                Object.assign(queue[l-1][1],message[1])
            } else {
                queue.push(message); // pushed without call back
            }
            storage.setItem("queue", JSON.stringify(queue))
        }
    } else {
        // rendering on the server
        console.info("apiWrapper Push from server side", message)
        ;
    }
}

function apiWrapperFlush(forceUpdate) {
    if(typeof window!== 'undefined' && this && this.props && this.props.user) {
        let message;
        let storage=window.localStorage;
        let json=storage.getItem("queue");
        if(!json) return;
        var queue=json ? JSON.parse(json) : [];
        if(queue.length) { 
            var sent=0;
            while(message=queue.shift()){
                ++sent;
                console.info("apiWrapperFlush:", message);
                window.socket.emit(...message,()=>(--sent<=0 && !queue.length && forceUpdate()));  // if sent is still positive or queue still has items in it, don't do anything, otherwise call the call back
            }
        }
        storage.removeItem("queue");
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

var apiWrapper={
    Push: apiWrapperPush,
    Flush: apiWrapperFlush,
    Immediate: apiWrapperImmediate,
    Update1OrPush: apiWrapperUpdate1OrPush
}

export default apiWrapper;

