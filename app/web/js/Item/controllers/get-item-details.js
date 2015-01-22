! function () {

  'use strict';

  function getItemDetails ($details, item) {
    var app = this;

    var Socket = app.importer.emitter('socket');

    $details.addClass('is-loaded');

    Socket.emit('get item details', item);

    Socket.once('got item details', function (itemDetails) {

      itemDetails.criterias.forEach(function (criteria, index) {
        app.render('details votes', [itemDetails, index],
          function (detailsView) {
            detailsView.removeClass('template-model');
            $details.find('.details-votes').append(detailsView);
          });
      });

      if ( itemDetails.feedbacks.length ) {
        itemDetails.feedbacks.forEach(function (feedback) {
          app.render('details feedback', feedback,
            function (feedbackView) {
              feedbackView.removeClass('template-model');
              $details.find('.details-feedbacks').append(feedbackView);
            });
        });
      }

      else {
        $details.find('.details-feedbacks h4').css('display', 'none');
      }
    });
  }

  module.exports = getItemDetails;

} ();
