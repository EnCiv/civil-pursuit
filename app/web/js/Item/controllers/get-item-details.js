! function () {

  'use strict';

  function getItemDetails ($details, item) {
    var div = this;

    var Socket = div.root.emitter('socket');

    $details.addClass('is-loaded');

    Socket.emit('get item details', item);

    Socket.once('got item details', function (details) {

      console.warn('got details', details)

      details.criterias.forEach(function (criteria, index) {
        luigi('tpl-details-votes')
          .controller(div.controller('details votes')(details, criteria))
          .controller(function ($votes) {
            $details.find('.votes-by-criteria').append($votes);
          });
        // app.render('details votes', [details, index],
        //   function (detailsView) {
        //     detailsView.removeClass('template-model');
        //     $details.find('.details-votes').append(detailsView);
        //   });
      });

      if ( details.feedbacks.length ) {
        details.feedbacks.forEach(function (feedback) {
          luigi('tpl-details-feedback')
            .controller(function ($feedback) {
              $details.find('.feedback-list').append($feedback);
            });
          // app.render('details feedback', feedback,
          //   function (feedbackView) {
          //     feedbackView.removeClass('template-model');
          //     $details.find('.details-feedbacks').append(feedbackView);
          //   });
        });
      }

      else {
        $details.find('.details-feedbacks h4').css('display', 'none');
      }
    });
  }

  module.exports = getItemDetails;

} ();
