! function () {

  'use strict';

  function listenToBroadcast () {
    var app = this;

    var Socket = app.importer.emitter('socket');

    // Inserted feedback

    Socket.on('inserted feedback', function (feedback) {
      var $item = $('#item-' + feedback.item);

      if ( $item.length ) {
        app.render('details feedback', feedback,
          function (feedbackView) {
            feedbackView.removeClass('template-model');

            feedbackView.insertAfter($item.find('.details').eq(0)
              .find('.details-feedbacks h4'));
          });
      }
    });
  }

  module.exports = listenToBroadcast;

} ();
