! function () {
  
  'use strict';

  var html5               =   require('syn/lib/html5');

  function PromoteImage (hand) {
    return html5.Element('.image.gutter', {
      style         :   'float: left; width: 40%',
      $className    :   hand + '-item'
    });
  }

  function PromoteSubject (hand) {
    return html5.Element('.subject.gutter', {
      $className    :   hand + '-item'
    }).add(html5.Element('h4'));
  }

  function Promote (locals) {
    return html5.Element('section').add(
      
      html5.Element('header.promote-steps').add(
        html5.Element('h2').add(
          html5.Element('span.cursor', { $text: '1' }),
          html5.Element('span', { $text: ' of ' }),
          html5.Element('span.limit', { $text: '5' })
        ),

        html5.Element('h4', { $text: 'Evaluate each item below' })
      ),

      html5.Element('.items-side-by-side').add(
        // 1 column
        html5.Element('.split-hide-up').add(
          PromoteImage('left')
        ),

        // 2 columns
        html5.Element('.split-hide-down').add(
          html5.Element('.row').add(
            html5.Element('.split-50.watch-100').add(
              PromoteImage('left'),
              PromoteSubject('left')
            )
          )
        )
      )

    );
  }

  module.exports = Promote;

} ();
