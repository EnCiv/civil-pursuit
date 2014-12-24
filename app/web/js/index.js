;! function () {

  'use strict';

  var trueStory = require('/home/francois/Dev/true-story.js/lib/TrueStory');

  trueStory()

    .model(require('./model'))

    .view(require('./view'))

    .controller(require('./controller'))

    /**
     *  @when model "intro" on "all"
     *  @then call controller "apply template to panel"
     */

    .tell(trueStory
      .when({ model: 'intro' }, { on: 'all' })
        .then(function (intro) {
          this.controller('bind panel')(this.view('intro'), {
            type: intro.new.subject
          });
        }))

    /**
     *  @when model "panels" on "push"
     *  @then for each added apply template "panel"
     */

    .tell(trueStory
      .when({ model: 'panels' }, { on: 'push' })
        .then(function (panels) {
          var app = this;

          app.controller('panels template')(panels);

          panels.forEach(app.controller('get panel items').bind(app));
        }))

    /**
     *  @when model "items" on "concat"
     *  @then 
     */

    .tell(trueStory
      .when({ model: 'items' }, { on: 'concat' })
        .then(function (items) {
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

          // process.nextTick(function () {
          //   app.controller('items template')(items, panel.view);
          // });
        }))

    /**
     *  run
     */

    .run(function () {
      this.controller('get intro')();

      this.model('panels').push({ type: 'Topic' });
    });
  
}();