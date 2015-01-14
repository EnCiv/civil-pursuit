! function () {

  'use strict';

  module.exports = {
    template: '.feedback-section',
    controller: function (view, feedback) {
      view.find('.feedback .pre-text').text(feedback.feedback);
    }
  };

} ();
