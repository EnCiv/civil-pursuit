'use strict'

import {EventEmitter} from 'events';
import domain from 'domain';
import cache from 'syn/lib/app/Cache';

class App extends EventEmitter {

  constructor (connect) {

    super();

    this.socket();

    if ( connect ) {
      this.socket.on('welcome', user => {
        this.socket.synuser = user;
        this.emit('ready');
      });
    }

    this.store = {
      onlineUsers: 0
    };

    this.socket.on('online users', online => this.set('onlineUsers', online));

    this.domain = domain.create()
      .on('error', error => this.emit('error', error));

    this.domain.intercept = handler => (error, ...args) => 
      this.domain.run(() => {
        if ( error ) {
          throw error;
        }
        handler(...args);
      });

  }

  get (key) {
    return this.store[key];
  }

  set (key, value) {
    this.store[key] = value;

    this.emit('set', key, value);

    return this;
  }

  error (err) {
    console.log('App error');
  }

  ready (fn) {
    this.on('ready', fn);
  }

  socket () {

    if ( ! io.$$socket ) {
      io.$$socket = io.connect('http://' + window.location.hostname + ':' + window.location.port);
    }

    this.socket = io.$$socket;

  }

  publish (event, ...messages) {

    let unsubscribe = () => {
      this.socket.removeListener('OK ' + event, this.handler);
    };

    return {
      subscribe: (handler) => {
        this.socket
          .on('OK ' + event, (...responses) =>
            handler({ unsubscribe: unsubscribe.bind(handler)}, ...responses)  
          )
          .emit(event, ...messages);
      }
    };

  }

  load () {

    if ( ! this.template ) {
      if ( cache.getTemplate(this.componentName) ) {
        this.template = $(cache.getTemplate(this.componentName));
      }

      else {
        let View = this.view;
        let view = new View(this.props);
        cache.setTemplate(this.componentName, view.render());
        this.template = $(cache.getTemplate(this.componentName));
      }
    }

    return this.template;
  }

}

export default App;



































function anon () {

  'use strict';

  var domain    =   require('domain');
  var Socket    =   require('syn/lib/app/Socket');
  var Cache     =   require('syn/lib/app/Cache');

  function Domain (onError) {
    return domain.create().on('error', onError);
  }

  /**
   *  @class Synapp
   *  @extends EventEmitter
   */

  function Synapp () {
    var self = this;

    this.domain = new Domain(function (error) {
      console.error('Synapp error', error.stack);
    });

    this.domain.intercept = function (fn, _self) {

      if ( typeof fn !== 'function' ) {
        fn = function () {};
      }

      return function (error) {
        if ( error && error instanceof Error ) {
          self.domain.emit('error', error);
        }

        else {
          var args = Array.prototype.slice.call(arguments);

          args.shift();

          fn.apply(_self, args);
        }
      };
    };

    this.location = {};

    this.cache = new Cache();

    this.domain.run(function () {

      /** Location */

      if ( window.location.pathname ) {

        if ( /^\/item\//.test(window.location.pathname) ) {
          self.location.item = window.location.pathname.split(/\//)[2];
        }

      }

      self.socket = new Socket(self.emit.bind(self)).socket;

      // self.evaluations = [];

      // self.cache = {
      //   template: {
      //     item: null
      //   }
      // };

      // if ( synapp.user ) {
      //   $('.is-in').removeClass('is-in');
      // }
    });
  }

  require('util').inherits(Synapp, require('events').EventEmitter);

  /**
   *  @method connect
   *  @description Sugar to register a listener to the "connect" event
   *  @arg {function} fn
   *  @deprecated Use ready instead
   */

  Synapp.prototype.connect = function (fn) {
    this.on('connect', fn);

    return this;
  };

  /**
   *  @method ready
   *  @description Sugar to register a listener to the "ready" event
   *  @arg {function} fn
   */

  Synapp.prototype.ready = function (fn) {
    this.on('ready', fn);

    return this;
  };

  // Export

  if ( module && module.exports ) {
    module.exports = Synapp;
  }

  if ( typeof window === 'object' ) {
    window.Synapp = Synapp;
  }

}
