;! function () {

  'use strict';

  var trueStory = require('/home/francois/Dev/true-story.js/lib/TrueStory');

  trueStory()

    .model(require('./model'))

    .view(require('./views'))

    .controller('monson GET',   require('./controllers/monson-get'))

    .controller('template',     require('./controllers/template'))

    .controller('get intro',    require('./controllers/get-intro'))

    .controller('apply template to panels',
      require('./controllers/apply-template-to-panels'))

    /**
     *  @when model "panels" on "add"
     *  @then for each added apply template "panel"
     */

    .tell(trueStory
      .when({ model: 'panels' }, { on: 'push' })
        .then(function (panels) {
          this.controller('apply template to panels')(panels);
        }))

    .run(function () {
      this.controller('get intro')();

      this.model('panels').push({ type: 'Topic' });
    });
  
}();