import { jest } from '@jest/globals'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import clientIo from 'socket.io-client'

// creates global.window if it doesn't exits
// mocks window.socket with a real socket but can be run by multiple jest tests in parallel
// creates a new server and client pair for each parallel test but using a distinct io port

var SocketIoPort = 3000

export default async function jestSocketApiSetup(userId, handleApiPairs) {
  if (typeof window === 'undefined') global.window = {}
  if (!global.window.socket) {
    global.window.socket = {}
    // for jest.spyOn to work, we have to define a getter, even though we are going to over write it
    Object.defineProperty(global.window, 'socket', {
      get: function () {
        console.log('you  are getting socket')
        return {}
      },
    })
  }

  // setup socket.io server
  const httpServer = createServer()
  const io = new Server(httpServer)
  let connections = 0
  io.on('connection', socket => {
    connections++
    // synuser info is used by APIs as this.synuser
    socket.synuser = { id: userId }
    for (const [handle, socketApi] of handleApiPairs) socket.on(handle, socketApi.bind(socket)) // this is what we are testing
    socket.on('disconnect', reason => {
      if (--connections <= 0) {
        io.close() // so test will finish
      }
    })
  })
  // we start the server, but the port may be in use
  const serverPort = new Promise((ok, ko) => {
    httpServer.on('error', e => {
      if (e.code === 'EADDRINUSE') {
        httpServer.close()
        httpServer.listen(SocketIoPort++)
      } else throw e
    })
    httpServer.listen(SocketIoPort++, () => {
      const port = httpServer.address().port
      ok(port)
    })
  })
  const port = await serverPort
  // start socket.io client connection to server
  const socket = clientIo.connect(`http://localhost:${port}`)
  // spyOn allows us to have a different window.socket for each test running in parallel
  const windowSpy = jest.spyOn(window, 'socket', 'get')
  socket.on('disconnect', windowSpy.mockRestore)
  windowSpy.mockImplementation(() => socket)
  await new Promise((ok, ko) => {
    socket.on('connect', () => {
      ok()
    })
  })
}

export function jestSocketApiTeardown() {
  if (window.socket) {
    window.socket.close()
    delete window.socket
  }
}
