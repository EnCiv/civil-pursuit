! function () {

  'use strict';

  function toggleDetails () {
    var app = this;
    var Panel = app.importer.extension('Panel');

    var $panel    =   $(this).closest('.panel');
    var $item     =   $(this).closest('.item');
    var $details  =   $item.find('>.collapsers >.details');

    if ( $details.hasClass('is-shown') ) {
      Panel.controller('scroll to point of attention')($item,
        function () {
          Panel.controller('hide')($details);
        });
    }
    else {
      Panel.controller('reveal')($details, $item, function () {

      // promoted bar

      $details.find('.progress-bar')
        .css('width', Math.floor(item.promotions * 100 / item.views) + '%')
        .text(Math.floor(item.promotions * 100 / item.views) + '%');

      // mail a friend

      var link = window.location.protocol + '//' + window.location.hostname +
        '/item/' + item._id + '/' + require('string')(item.subject).slugify();

      $details.find('.invite-people-body').attr('placeholder',
        $details.find('.invite-people-body').attr('placeholder') +
        link);

      $details.find('.invite-people').attr('href',
        'mailto:?subject=' + item.subject + '&body=' +
        ($details.find('.invite-people-body').val() ||
        $details.find('.invite-people-body').attr('placeholder')) +
        "%0A%0A" + ' Synaccord - ' + link);

      if ( ! $details.hasClass('is-loaded') ) {
        $details.addClass('is-loaded');

        // Votes and feedbacks

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

        // Edit and go again

        $details.find('.edit-and-go-again').on('click', function () {
          Panel.controller('scroll to point of attention')(view,
            function () {
              Panel.controller('hide')($details, function () {
                app.render('edit and go again', item, function (editAndGoAgainView) {
                  view.find('>.collapsers >.editor')
                    .empty()
                    .append(editAndGoAgainView);

                  Panel.controller('reveal')(
                    view.find('>.collapsers >.editor'), view);
                });
              });
            });
        });
      }

      });
    }
  }

  module.exports = toggleDetails;

} ();
