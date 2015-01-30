/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  SYNAPP

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function () {

  'use strict';

  var Panel = require('./Panel');
  var Sign = require('./Sign');
  var Intro = require('./Intro');
  var domain = require('domain');

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

    this.socket.on('connect', function () {
      self.topLevelPanel(self.domain.intercept(function () {
        self.intro();
      }));
    });

    this.evaluations = [];

    this.cache = {
      template: {
        item: null
      }
    };

    console.info(synapp.user, $('.is-in'))

    if ( synapp.user ) {
      $('.is-in').removeClass('is-in');
    }
  }

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

  Synapp.prototype.intro = function () {
    console.log('hello')
    new Intro().render();
  };

  window.Synapp = Synapp;

} ();
