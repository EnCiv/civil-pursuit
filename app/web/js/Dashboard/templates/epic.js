! function () {

  'use strict';

  module.exports = {
    template: '.epic',
    controller: function (view, epic) {
      view.find('.epic-name').text(epic.title);

      view.find('.epic-description').text(epic.description);
    }
  };

} ();
