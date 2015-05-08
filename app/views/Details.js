! function () {
  
  'use strict';

  var html5   =   require('syn/lib/html5');
  var Element =   html5.Element;

  /**
   *  @function
   *  @return
   *  @arg
   */

  function Promote (locals) {
    var section = Element('section').add(
      Element('section.feedback-pending.hide').add(
        Element('h4', { $text: 'Feedback pending' }),
        Element('p', { $text: 'While you are waiting for your feedback this is a great time to invite the people you know to join the effort to bring synergy to democracy.' }),
        Element('a.btn.invite-people', { target: '_blank',
          $text: 'Send' }),
        Element('hr')
      ),

      Element('.row').add(
        Element('.tablet-30.middle').add(
          Element('h4', { $text: 'Promoted' })
        ),

        Element('.tablet-70.middle').add(
          Element('.progress')
        )
      )
    );

    for ( var i = 0; i < 4; i ++ ) {
      section.add(
        Element('.row.details-votes').add(
          Element('.tablet-30.middle').add(
            Element('h4', {
              'data-toggle'     :   'tooltip',
              'data-placement'  :   'top'
            })
          )
        )
      );
    }

    return section;
  }

  module.exports = Promote;

} ();
