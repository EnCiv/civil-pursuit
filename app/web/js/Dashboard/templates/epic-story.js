! function () {

  'use strict';

  module.exports = {
    template: '.epic-story',
    controller: function (view, story) {
      view.find('.story-name').text(story.story);
    }
  };

} ();
