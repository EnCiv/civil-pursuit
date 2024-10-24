// const unsubscribe=socketApiSubscribe('socket-api-name',id,..., resultHandler, updateHandler)
//
// socket-api-name - the name part of the file in socket_apis
// id - a unique id for the data being subscribed to, usually a mongo objectId
// resultHandler - the initial api call will return a result that is handled here
// updateHandler - asynchronous updates to the data will be sent here
// return a function to unsubscribe
export default function socketApiSubscribe(handle, id, ...args) {
  const updateHandler = args.pop()
  const resultHandler = args.pop()
  if (typeof resultHandler !== 'function')
    throw new Error('socketApiSubscribe resultHandler not a function, got:', typeof resultHandler)
  if (typeof updateHandler !== 'function')
    throw new Error('socketApiSubscribe updateHandler not a function, got:', typeof updateHandler)
  const eventName = subscribeEventName(handle, id)
  window.socket.on(eventName, updateHandler)
  window.socket.emit(handle, id, ...args, resultHandler)
  return () => {
    window.socket.emit('unsubscribe', eventName)
  }
}

export function subscribeEventName(handle, id) {
  return `${handle}:${id}`
}
