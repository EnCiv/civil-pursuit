/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  S   Y   N   A   P   P

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var domain    =   require('domain');

  /**
   *  @class Synapp
   *  @extends EventEmitter
   */

  function Synapp () {
    var self = this;

    this.domain = domain.create();

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

    this.domain.on('error', function (error) {
      console.error('Synapp error', error.stack.split(/\n/));
    });

    this.location = {};

    this.domain.run(function () {

      /** Location */

      if ( window.location.pathname ) {

        if ( /^\/item\//.test(window.location.pathname) ) {
          self.location.item = window.location.pathname.split(/\//)[2];
        }

      }

      /** Socket */
      self.socket = io.connect(synapp.protocol + '://' + location.hostname + ':' + location.port);

      self.socket.once('connect', function () {
        /** @deprecated */
        self.emit('connect');

        self.emit('ready');
      });

      self.socket.on('error', function (error) {
        console.log('socket error', error);
      });

      self.evaluations = [];

      self.cache = {
        template: {
          item: null
        }
      };

      if ( synapp.user ) {
        $('.is-in').removeClass('is-in');
      }
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

} ();
