;! function () {

  'use strict';

  var trueStory = require('/home/francois/Dev/true-story.js/lib/TrueStory');

  trueStory()

    .model(require('./model'))

    .model('socket', io.connect('http://' + window.location.hostname + ':' + window.location.port), true)

    .view(require('./view'))

    .controller(require('./controller'))

    /** @when *all* model "intro" */

    .when({ model: 'intro' }, { on: 'all' },
      function (intro) {
        this.controller('bind panel')(this.view('intro'), {
          type: intro.new.subject
        });
        this.controller('bind item')(intro.new, this.view('intro'));
      })

    /** @when push model "panels" */

    .when({ model: 'panels' }, { on: 'push' },
      function (panels) {
        this.controller('panels template')(panels);
        panels.forEach(this.controller('get panel items').bind(this));
      })

    /** @when concat model "items" */

    .when({ model: 'items' }, { on: 'concat' },
      function (items) {
        var app = this;

        var panel = app.controller('find panel')({
          type: items[0].type,
          parent: items[0].parent
        });

        if ( ! panel.view ) {
          app.watch(panel)
            .on('add view', function (view) {
              app.controller('items template')(items, view.new);
            });
        }

        else {
          app.controller('items template')(items, panel.view);
        }
      })

    /** @when model "socket" emits "connection" */

    .when({ model: 'socket' }, { on: 'connect' },
      function (conn) {
        console.info('[✔]', 'connected to web socket server');
      })

    /** @when model "socket" emits "online users" */

    .when({ model: 'socket' }, { on: 'online users' },
      function (online_users) {
        this.model('online users', online_users);
      })

    /** @when model "socket" emits "online users" */

    .when({ model: 'online users' }, { on: 'all' },
      function (online_users) {
        this.view('online users').text(online_users.new);
      })

    /**
     *  run
     */

    .run(function () {
      this.controller('get intro')();

      // this.model('panels').push({ type: 'Topic' });
    });
  
}();