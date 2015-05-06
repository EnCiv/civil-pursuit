! function () {
  
  'use strict';

  var html5               =   require('syn/lib/html5');

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Promote (locals) {
    return html5.Element('section').add(
      html5.Element('section.feedback-pending.hide').add(
        html5.Element('h4', { $text: 'Feedback pending' }),
        html5.Element('p', { $text: 'While you are waiting for your feedback this is a great time to invite the people you know to join the effort to bring synergy to democracy.' }),
        html5.Element('a.btn.invite-people', { target: '_blank',
          $text: 'Send' })
      )
    );
  }

  module.exports = Promote;

} ();
