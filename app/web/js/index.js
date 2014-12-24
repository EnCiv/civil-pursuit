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
      require('./when/model/intro/on/update'))

    /** @when push model "panels" */

    .when({ model: 'panels' }, { on: 'push' },
      require('./when/model/panels/on/push'))

    /** @when concat model "items" */

    .when({ model: 'items' }, { on: 'concat' },
      require('./when/model/items/on/concat'))

    /** @when model "socket" emits "connection" */

    .when({ model: 'socket' }, { on: 'connect' },
      require('./when/model/socket/on/connect'))

    /** @when model "socket" emits "online users" */

    .when({ model: 'socket' }, { on: 'online users' },
      require('./when/model/socket/on/online users'))

    /** @when model "socket" emits "online users" */

    .when({ model: 'online users' }, { on: 'all' },
      require('./when/model/online users/on/all'))

    /**
     *  run
     */

    .run(function () {
      
    });
  
}();