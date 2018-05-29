'use strict';

//
// apiWrapper is a collection of functions used by the socket.io based api 
// each api call, will used these funtions to:
//  1) send the api message from the client to the server over socke.emit
//  2) queue the api message on the client if the users has not logged in yet (in the case of pushing data)
//  3) call the actual function without going through the socket if running if client code is being run on the server side
//

var queue=[];  // this variable is accessible to all the functions declared in this module, but is not globally accessible.

var apiWrapperPush =(message)=>{
    if(typeof window !== undefined){
        // rendering in the browser
        if(this && this.props && this.props.user)
            window.socket.emit(...message);
        else
            queue.push(message);
    } else {
        // rendering on the server
        console.info("apiWrapper Push from server side", message)
        ;
    }
}

var apiWrapperFlush=()=>{
    let message;
    while(message=queue.shift){
        window.socket.emit(...message);
    }
}

module.exports.apiWrapperPush=apiWrapperPush;
module.exports.apiWrapperFlush=apiWrapperFlush;

apiWrapper={
    Push: apiWrapperPush,
    Flush: apiWrapperFlush
}

export default apiWrapper;

