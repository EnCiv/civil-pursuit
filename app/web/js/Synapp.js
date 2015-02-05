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

  var Panel     =   require('./Panel');
  var Sign      =   require('./Sign');
  var Intro     =   require('./Intro');
  var domain    =   require('domain');

  /**
   *  @class Synapp
   *  @extends EventEmitter
   */

  function Synapp () {
    var self = this;

    self.Panel = Panel;

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
      console.error(error);
    });

    this.socket = io.connect('http://' + location.hostname + ':' + location.port);

    this.socket.once('connect', function () {
      self.emit('connect');
    });

    this.evaluations = [];

    this.cache = {
      template: {
        item: null
      }
    };

    if ( synapp.user ) {
      $('.is-in').removeClass('is-in');
    }
  }

  require('util').inherits(Synapp, require('events').EventEmitter);

  /**
   *  @method connect
   *  @description Sugar to register a listener to the "connect" event
   *  @arg {function} fn
   */

  Synapp.prototype.connect = function (fn) {
    this.on('connect', fn);

    return this;
  };

  /**
   *  @method topLevelPanel
   *  @description Insert a new top-level panel
   *  @arg {function} cb
   */

  Synapp.prototype.topLevelPanel = function (cb) {
    var self = this;

    var panel = new Panel('Topic');

    panel
      
      .get(self.domain.intercept(function (template) {

        $('.panels').append(template);

        setTimeout(function () {
          panel.render(self.domain.intercept(function () {
            panel.fill(cb);
          }));
        }, 700);
      }));
  };

  // Export

  if ( module && module.exports ) {
    module.exports = Synapp;
  }

  if ( typeof window === 'object' ) {
    window.Synapp = Synapp;
  }

} ();
