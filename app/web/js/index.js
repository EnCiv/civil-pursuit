;! function () {

  'use strict';

  var trueStory = require('/home/francois/Dev/true-story.js/lib/TrueStory');

  trueStory()

    .on('error', function (error) {
      console.error(error.message);
    })

    .model(require('./model'))

    .model('socket', io.connect('http://' + window.location.hostname + ':' + window.location.port), true)

    .view(require('./view'))

    .controller(require('./controller'))

    /** @when *all* model "intro" */

    .when({ model: 'intro' }, { on: 'update' },
      function (intro) {

        var app = this;

        this.view('intro').find('.panel-title').text(intro.new.subject);

        this.view('intro').find('.item-title').text(intro.new.subject);

        this.view('intro').find('.description').text(intro.new.description);

        this.view('intro').find('.item-media').append(
          this.controller('bootstrap/responsive-image')({
            src: intro.new.image
          }));

        this.view('intro').find('.item-references').hide();
        
      })

    /** @when push model "panels" */

    .when({ model: 'panels' }, { on: 'push' },
      function (panels) {

        var app = this;

        /** Apply panel template to each pushed (new) panel */
        this.controller('panels template')(panels);

        this.when({ model: 'template_panels_done' }, { on: 'all' },
          function () {
            console.error('big PAYBACK')
            /** Get items of each new panel */
            panels.forEach(app.controller('get panel items').bind(app));
          });
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
        console.info('[✔]', "\tsocket \t", 'connected to web socket server');

        this.controller('get intro')();

        // this.model('panels').push({ type: 'Topic' });
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
      
    });
  
}();