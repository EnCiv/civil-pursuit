! function () {
  
  'use strict';

  var html5               =   require('syn/lib/html5');
  var Element       =     html5.Element;

  function PromoteImage (hand) {
    return Element('.image.gutter', {
      style         :   'float: left; width: 40%',
      className     :   [hand + '-item']
    });
  }

  function PromoteSubject (hand) {
    return Element('.subject.gutter', {
      className    :   [hand + '-item']
    }).add(Element('h4'));
  }

  function PromoteDescription (hand) {
    return Element('.description.gutter.pre-text', {
      className    :   [hand + '-item']
    });
  }

  function PromoteReference (hand) {
    return Element('.references.gutter', {
      className    :   [hand + '-item']
    }).add(Element('a', {
      rel       :   'nofollow',
      target    :   '_blank'
    }));
  }

  function PromoteSliders (hand) {

    var sliders = Element('.sliders', {
      className:  [hand + '-item']
    });

    for ( var i = 0; i < 4; i ++ ) {
      var slider = Element('.criteria-wrapper');

      slider.add(Element('row').add(
        Element('.tablet-40').add(
          Element('h4').add(
            Element('button.criteria-name.shy.block', {
              $text: 'Criteria'
            })
          )
        ),

        Element('.tablet-60', {
          style: 'margin-top: 2.5em'
        }).add(
          Element('input.block', {
            type: 'range',
            min: '-1',
            max: '1',
            value: '0',
            step: '1'
          })
        )
      ));

      slider.add(Element('.row.is-container.criteria-description-section').add(
          Element('.is-section').add(
            Element('.gutter.watch-100.criteria-description')
          )
        ));

      sliders.add(slider);
    }

    return sliders;
  }

  function PromoteFeedback (hand) {
    return Element('.feedback', {
      className    :   [hand + '-item']
    }).add(
      Element('textarea.feedback-entry.block', {
        placeholder : 'Can you provide feedback that would encourage the author to create a statement that more people would unite around?'
      })
    );
  }

  function Promote (locals) {
    return Element('section').add(
      
      Element('header.promote-steps').add(
        Element('h2').add(
          Element('span.cursor', { $text: '1' }),
          Element('span', { $text: ' of ' }),
          Element('span.limit', { $text: '5' })
        ),

        Element('h4', { $text: 'Evaluate each item below' })
      ),

      Element('.items-side-by-side').add(
        // 1 column
        Element('.split-hide-up').add(
          PromoteImage('left'),
          PromoteSubject('left'),
          PromoteDescription('left'),
          PromoteReference('left'),
          PromoteSliders('left'),
          PromoteFeedback('left'),

          PromoteImage('right'),
          PromoteSubject('right'),
          PromoteDescription('right'),
          PromoteReference('right'),
          PromoteSliders('right'),
          PromoteFeedback('right')
        ),

        // 2 columns
        Element('.split-hide-down').add(
          Element('.row').add(
            Element('.split-50.watch-100').add(
              PromoteImage('left'),
              PromoteSubject('left'),
              PromoteDescription('left')
            ),

            Element('.split-50.watch-100').add(
              PromoteImage('right'),
              PromoteSubject('right'),
              PromoteDescription('right')
            )
          ),

          Element('.row').add(
            Element('.split-50.watch-100').add(
              PromoteReference('left')
            ),

            Element('.split-50.watch-100').add(
              PromoteReference('right')
            )
          ),

          Element('.row').add(
            Element('.split-50.watch-100').add(
              PromoteSliders('left'),
              PromoteFeedback('left')
            ),

            Element('.split-50.watch-100').add(
              PromoteSliders('right'),
              PromoteFeedback('right')
            )
          )
        )
      )

    );
  }

  module.exports = Promote;

} ();
