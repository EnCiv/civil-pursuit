'use strict';

import {EventEmitter}     from 'events';
import fs                 from 'fs';
import path               from 'path';
import {Domain}           from 'domain';
import SocketIO           from 'socket.io';
import S                  from 'string';
import cookieParser       from 'cookie-parser';
import ss                 from 'socket.io-stream';

class API extends EventEmitter {

  constructor (server) {
    super();

    process.nextTick(() => {
      try {
        this.server = server;
        this.users = [];
        this.handlers = [];

        this.on('error', this.server.emit.bind(server, 'error'));
        this.on('message', this.server.emit.bind(server, 'message'));

        this.fetchHandlers();
      }
      catch ( error ) {
        this.emit('error', error);
      }
    });
  }

  fetchHandlers () {
    try {
      fs.readdir(path.join(__dirname, 'api'), (error, files) => {
        try {
          if ( error ) {
            throw error;
          }

          files.forEach(file => {
            const name      =   S(file.replace(/\.js$/, ''))
              .humanize()
              .s
              .toLowerCase();

            const handler   =   require('./api/' + file);

            this.emit('message', 'Add handler', [name, handler, S(file.replace(/\.js$/, '')).humanize().s]);

            this.handlers[name] = handler;
          });

          this.start();
        }
        catch ( error ) {
          this.emit('error', error);
        }
      });
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

  start () {
    try {
      this.io = SocketIO.listen(this.server.server);
      this.emit('message', 'socketIO listening');
      this.io
        .use(this.identify.bind(this))
        .on('connection', this.connected.bind(this));
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

  /** Find user by id in [User]
   *  @arg      {String} id
  */

  findUserById (id) {
    return this.users.reduce((found, user) => {
      if ( user.id === id ) {
        found = user;
      }
      return found;
    }, null);
  }

  /** Identify client
   *  @arg      {Socket} socket
   *  @arg      {Function} next
  */

  identify (socket, next) {
    try {
      const req = {
        "headers"     :   {
          "cookie"    :   socket.request.headers.cookie
        }
      };

      cookieParser()(req, null, () => {});

      const cookie = req.cookies.synuser;

      if ( cookie ) {

        if ( ! this.findUserById(cookie.id) ) {
          this.pushUser(cookie);
        }

        socket.synuser = cookie;
      }

      next();
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

  /** New user
   *  @arg      {User} user
  */

  pushUser (user) {
    this.users.push(user);
  }

  /** On every client's connection
   *  @arg      {Socket} socket
  */

  connected (socket) {
    try {
      console.log('connected');
      socket.on('error', error => this.emit('error', error));

      this.emit('message', 'new socket connexion');

      socket.emit('welcome', socket.synuser);

      socket.broadcast.emit('online users', this.users.length);
      socket.emit('online users', this.users.length);
      console.log('online users', this.users.length);

      socket.ok = (event, ...responses) => {
        console.log('>>>'.green.bold, event.green.bold, ...responses);
        socket.emit('OK ' + event, ...responses);
      };

      socket.error = error => {
        this.emit('error', error);
      };

      for ( let handler in this.handlers ) {
        socket.on(handler, (...messages) =>
          console.log('<<<'.bold.cyan, handler.bold.cyan, ...messages)
        );
        socket.on(handler, this.handlers[handler].bind(socket, handler));
      }

      this.stream(socket);
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

  stream (socket) {
    try {
      ss(socket).on('upload image', (stream, data) => {
        console.log('<<<'.bold.cyan, 'upload image'.bold.cyan, stream, data)
        const filename = '/tmp/' + data.name;
        stream.pipe(fs.createWriteStream(filename));
      });
    }
    catch ( error ) {
      this.emit('error', error);
    }
  }

}

export default API;
