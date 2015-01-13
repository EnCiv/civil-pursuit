! function () {

  'use strict';

  module.exports = {
    template: '.epic-story',
    controller: function (view, story) {

      var app = this;

      view.find('.story-name')
        .text(story.story)
        .on('click', function () {
          app.emitter('socket').emit('run story', story.index,
            function (error, results) {
              
            });

          return false;
        });
    }
  };

} ();
