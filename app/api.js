'use strict';

import {EventEmitter}     from 'events';
import fs                 from 'fs';
import path               from 'path';
import {Domain}           from 'domain';
import SocketIO           from 'socket.io';
import S                  from 'string';
import cookieParser       from 'cookie-parser';
import ss                 from 'socket.io-stream';
import emitter            from './lib/app/emitter';

class API extends EventEmitter {

  constructor (server) {
    super();

    if ( server ) {
      process.nextTick(() => {
        try {
          this.server = server;
          this.users = [];
          this.handlers = {};
          this.sockets = [];

          this.on('error', this.server.emit.bind(server, 'error'));
          this.on('message', this.server.emit.bind(server, 'message'));

          emitter.on('update', (collection, document) => {
            if ( collection === 'items' ) {
              document.toPanelItem().then(
                item => {
                  this.sockets.forEach(socket => socket.emit('item changed', item));
                },
                this.emit.bind(this, 'error')
              );
            }
          });

          this.fetchHandlers()
            .then(
              () => this.start(),
              this.emit.bind(this, 'error')
            );
        }
        catch ( error ) {
          this.emit('error', error);
        }
      });
    }
  }

  fetchHandlers () {
    return new Promise((ok, ko) => {
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

              if ( typeof handler !== 'function' ) {
                throw new Error(`API handler ${name} (${file}) is not a function`);
              }

              this.handlers[name] = handler;

              this.handlers[name].slugName = file.replace(/\.js$/, '');
            });

            ok();
          }
          catch ( error ) {
            ko(error);
          }
        });
      }
      catch ( error ) {
        ko(error);
      }
    });
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

      let cookie = req.cookies.synuser;

      if ( cookie ) {

        if ( typeof cookie === 'string' ) {
          cookie = JSON.parse(cookie);
        }

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

      this.emit('message', { socket });

      this.sockets.push(socket);

      socket.on('error', error => this.emit('error', error));

      this.emit('message', 'new socket connexion');

      socket.emit('welcome', socket.synuser);

      socket.broadcast.emit('online users', this.users.length);
      socket.emit('online users', this.users.length);

      socket.ok = (event, ...responses) => {
        this.emit('message', '>>>'.green.bold, event.green.bold, ...responses);
        socket.emit('OK ' + event, ...responses);
      };

      socket.error = error => {
        this.emit('error', error);
      };

      for ( let handler in this.handlers ) {
        socket.on(handler, (...messages) =>
          this.emit('message', '<<<'.bold.cyan, handler.bold.cyan, ...messages)
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
