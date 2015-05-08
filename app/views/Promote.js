! function () {
  
  'use strict';

  var html5               =   require('syn/lib/html5');

  function PromoteImage (hand) {
    return html5.Element('.image.gutter', {
      style         :   'float: left; width: 40%',
      className     :   [hand + '-item']
    });
  }

  function PromoteSubject (hand) {
    return html5.Element('.subject.gutter', {
      className    :   [hand + '-item']
    }).add(html5.Element('h4'));
  }

  function PromoteDescription (hand) {
    return html5.Element('.description.gutter.pre-text', {
      className    :   [hand + '-item']
    });
  }

  function PromoteReference (hand) {
    return html5.Element('.references.gutter', {
      className    :   [hand + '-item']
    }).add(html5.Element('a', {
      rel       :   'nofollow',
      target    :   '_blank'
    }));
  }

  function PromoteSliders (hand) {

    var sliders = html5.Element('.sliders', {
      className:  [hand + '-item']
    });

    for ( var i = 0; i < 4; i ++ ) {
      var slider = html5.Element('.criteria-wrapper');

      slider.add(html5.Element('row').add(
        html5.Element('.tablet-40').add(
          html5.Element('h4').add(
            html5.Element('button.criteria-name.shy.block', {
              $text: 'Criteria'
            })
          )
        ),

        html5.Element('.tablet-60', {
          style: 'margin-top: 2.5em'
        }).add(
          html5.Element('input.block', {
            type: 'range',
            min: '-1',
            max: '1',
            value: '0',
            step: '1'
          })
        )
      ));

      slider.add(html5.Element('.row.is-container.criteria-description-section').add(
          html5.Element('.is-section').add(
            html5.Element('.gutter.watch-100.criteria-description')
          )
        ));

      sliders.add(slider);
    }
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
          PromoteImage('left'),
          PromoteSubject('left'),
          PromoteDescription('left'),
          PromoteReference('left'),
          PromoteSliders('left'),

          PromoteImage('right'),
          PromoteSubject('right'),
          PromoteDescription('right'),
          PromoteReference('right'),
          PromoteSliders('right')
        ),

        // 2 columns
        html5.Element('.split-hide-down').add(
          html5.Element('.row').add(
            html5.Element('.split-50.watch-100').add(
              PromoteImage('left'),
              PromoteSubject('left'),
              PromoteDescription('left')
            ),

            html5.Element('.split-50.watch-100').add(
              PromoteImage('right'),
              PromoteSubject('right'),
              PromoteDescription('right')
            )
          ),

          html5.Element('.row').add(
            html5.Element('.split-50.watch-100').add(
              PromoteReference('left')
            ),

            html5.Element('.split-50.watch-100').add(
              PromoteReference('right')
            )
          ),

          html5.Element('.row').add(
            html5.Element('.split-50.watch-100').add(
              PromoteSliders('left')
            ),

            html5.Element('.split-50.watch-100').add(
              PromoteSliders('right')
            )
          )
        )
      )

    );
  }

  module.exports = Promote;

} ();
