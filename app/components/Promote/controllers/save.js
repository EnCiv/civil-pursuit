! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function save (hand) {

    var promote = this;
   
    // feedback

    var feedback = promote.find('item feedback', hand);

    if ( feedback.val() ) {

      if ( ! feedback.hasClass('do-not-save-again') ) {
        app.socket.emit('insert feedback', {
          item: promote.evaluation[hand]._id,
          user: synapp.user,
          feedback: feedback.val()
        });

        feedback.addClass('do-not-save-again');
      }

      // feedback.val('');
    }

    // votes

    var votes = [];

    promote.template
      .find('.items-side-by-side:visible .' +  hand + '-item input[type="range"]:visible')
      .each(function () {
        var vote = {
          item: promote.evaluation[hand]._id,
          user: synapp.user,
          value: +$(this).val(),
          criteria: $(this).data('criteria')
        };

        votes.push(vote);
      });

    app.socket.publish('insert votes', votes, function votesInserted () {
      app.socket.removeListener('OK insert votes', votesInserted);
    });
  }

  module.exports = save;

} ();
