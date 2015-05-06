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
      html5.Element('header.promote-steps').add(
        html5.Element('h2').add(
          html5.Element('span.cursor', { $text: '1' }),
          html5.Element('span', { $text: ' of ' }),
          html5.Element('span.limit', { $text: '5' })
        )
      )
    );
  }

  module.exports = Promote;

} ();
