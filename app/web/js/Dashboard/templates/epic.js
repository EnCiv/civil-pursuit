! function () {

  'use strict';

  module.exports = {
    template: '.epic',
    controller: function (view, epic) {
      var app = this;

      view.find('.epic-name').text(epic.title);

      view.find('.epic-description').text(epic.description);

      epic.stories.forEach(function (story) {
        app.render('epic story', story, function (storyView) {
          storyView.removeClass('template-model');

          view.find('.epic-stories').append(storyView);
        });
      });
    }
  };

} ();
