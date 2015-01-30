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

    this.socket.on('connect', this.topLevelPanel.bind(this));

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

    new Sign().render();

    new Intro().render();
  }

  Synapp.prototype.topLevelPanel = function () {
    var self = this;

    var panel = new Panel('Topic');

    panel
      
      .get(self.domain.intercept(function (template) {

        $('.panels').append(template);

        setTimeout(function () {
          panel.render(self.domain.intercept(function () {
            panel.fill(self.domain.intercept());
          }));
        }, 700);
      }));
  };

  window.Synapp = Synapp;

} ();
