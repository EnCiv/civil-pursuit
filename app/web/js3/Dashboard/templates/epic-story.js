! function () {

  'use strict';

  module.exports = {
    template: '.epic-story',
    controller: function (view, story) {

      var app = this;

      view.find('.story-name')
        .text(story.story)
        .attr('href', '?story=' + story.index);

    }
  };

} ();
