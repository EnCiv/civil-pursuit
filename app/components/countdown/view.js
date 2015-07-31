'use strict';

import { Element, VElements }   from 'cinco/dist';
import PanelView                from '../panel/view';

class CountDownView extends Element {
  constructor (props) {
    super('#countdown');

    this.add(() => {
      let panel = new PanelView({ creator: false, title : 'Countdown' });

      panel
        .find('.items')
        .get(0)
        .add(
          new Element('#countdown-panel').add(
            new Element('header').add(
              new Element('h2').text('Countdown to discussion'),
              new Element('h1').text('Aug. 12, 2015 4:00 pm Pacific Standard Time'),
              new Element('h2.dynamic-countdown').add(
                new Element('span.countdown-days').text('0'),
                new Element('span.countdown-days-label').text(' days T '),
                new Element('span.countdown-hours').text('0'),
                new Element('span').text(':'),
                new Element('span.countdown-minutes').text('0'),
                new Element('span').text(':'),
                new Element('span.countdown-seconds').text('0')
              ),
              new Element('.row').add(
                new Element('.phone-30.phone-push-20').add(
                  new Element('h4').text('Registered participants')
                ),
                new Element('.phone-30').add(
                  new Element('h4').text('Goal')
                )
              ),
              new Element('.row').add(
                new Element('.phone-30.phone-push-20').add(
                  new Element('h2.discussion-registered').text('0')
                ),
                new Element('.phone-30').add(
                  new Element('h2.discussion-goal').text('0')
                )
              )
            ),
            new Element('.row').add(
              new Element('.phone-60.phone-push-20').add(
                new Element('.gutter').add(
                  new Element('button.large.block.primary.radius.discussion-register_button').text('Register'),
                  new Element('h4.text-center.success.discussion-is_registered.hide').text('Thank you for registering!')
                )
              )
            )
          )
        );

      return panel;
    });
  }
}

export default CountDownView;
