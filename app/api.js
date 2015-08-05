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

    let d = new Domain().on('error', error => this.emit('error', error));

    d.run(() => {
      this.server = server;

      this.on('error', error => this.server.emit('error', error));
      this.on('message', this.server.emit.bind(this.server, 'message'));

      this.users = [];
      this.handlers = {};

      this.fetchHandlers();
    });

  }

  fetchHandlers () {
    let d = new Domain().on('error', error => this.emit('error', error));

    d.run(() => {
      fs.readdir(path.join(__dirname, 'api'), d.intercept(files => {

        files.forEach(file => {
          let name      =   S(file.replace(/\.js$/, ''))
            .humanize()
            .s
            .toLowerCase();
          let handler   =   require('./api/' + file);

          this.emit('message', 'Add handler', [name, handler]);

          this.handlers[name] = handler;
        });

        this.start();

      }));
    });
  }

  start () {
    let d = new Domain().on('error', error => this.emit('error', error));

    d.run(() => {
      this.io = SocketIO.listen(this.server.server);
      this.emit('message', 'socketIO listening');
      this.io
        .use(this.identify.bind(this))
        .on('connection', this.connected.bind(this));
      });
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
    let d = new Domain().on('error', error => this.emit('error', error));

    d.run(() => {

      let req = {
        "headers"     :   {
          "cookie"    :   socket.request.headers.cookie
        }
      };

      cookieParser()(req, null, () => {});

      let cookie = req.cookies.synuser;

      console.log('cookie', cookie);

      if ( cookie ) {

        if ( ! this.findUserById(cookie.id) ) {
          this.pushUser(cookie);
        }

        socket.synuser = cookie;
      }

      next();
    });
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

  stream (socket) {
    ss(socket).on('upload image', function (stream, data) {
      console.log('<<<'.bold.cyan, 'upload image'.bold.cyan, stream, data)
      var filename = '/tmp/' + data.name;
      stream.pipe(fs.createWriteStream(filename));
    });
  }

}

export default API;
