'use strict';

//
// apiWrapper is a collection of functions used by the socket.io based api 
// each api call, will used these funtions to:
//  1) send the api message from the client to the server over socke.emit
//  2) queue the api message on the client if the users has not logged in yet (in the case of pushing data)
//  3) call the actual function without going through the socket if running if client code is being run on the server side
//

function apiWrapperPush(message){
    if(typeof window !== undefined){
        // rendering in the browser
        let storage=window.localStorage;
        let json=storage.getItem("queue");
        let queue=json ? JSON.parse(json) : [];

        if(this && this.props && this.props.user)
            window.socket.emit(...message);
        else {
            queue.push(message);
            storage.setItem("queue", JSON.stringify(queue))
        }
    } else {
        // rendering on the server
        console.info("apiWrapper Push from server side", message)
        ;
    }
}

function apiWrapperFlush() {
    if(typeof window!== 'undefined' && this && this.props && this.props.user) {
        let message;
        let storage=window.localStorage;
        let json=storage.getItem("queue");
        let queue=json ? JSON.parse(json) : [];

        while(message=queue.shift()){
            window.socket.emit(...message);
        }
        storage.removeItem("queue");
    }
}

module.exports.apiWrapperPush=apiWrapperPush;
module.exports.apiWrapperFlush=apiWrapperFlush;

var apiWrapper={
    Push: apiWrapperPush,
    Flush: apiWrapperFlush
}

export default apiWrapper;

