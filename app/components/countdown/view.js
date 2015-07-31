'use strict';

import { Element, VElements }   from 'cinco/dist';
import PanelView                from '../panel/view';

class CountDownView extends Element {
  constructor (props) {
    super('#countdown');

    this.props = props;

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
                new Element('.watch-30.watch-push-20').add(
                  new Element('h4').text('Registered participants')
                ),
                new Element('.watch-30').add(
                  new Element('h4').text('Goal')
                )
              ),
              new Element('.row').add(
                new Element('.watch-30.watch-push-20').add(
                  new Element('h2.discussion-registered').text('0')
                ),
                new Element('.watch-30').add(
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
          ),
          new Element('.hide.discussion-invite_people.gutter-bottom').add(
            new Element('h4.text-center').text('Invite the diverse people you know'),
            new Element('.row').add(
              new Element('.watch-50.watch-push-25').add(
                new Element('a.button.primary.block.discussion-invite_people-button_email', { href : `mailto:?subject=Democracy+Needs+You+-+Join+Me+in+Finding+the+Most+Important+Issues+in+our+Country&Body=Hi%0D%0A%0D%0AJoin+me+and+a+politically+diverse+group+of+people+on+http%3A%2F%2F${this.props.req.hostname}+to+find+consensus+on+the+most+important+issues+in+our+country%2C+and+then+find+the+solutions+that+unit+us.+Synaccord+is+beta+testing+a+web+app+that+helps+people+have+structured+conversations+in+diverse+groups+so+they+find+the+solutions+that+unite+us+and+disrupt+the+polarization+and+paralysis+that+we+are+getting+now.+Try+it+out%2C+democracy+needs+you.%0D%0ABut+sign+up+quickly%2C+the+test+group+closes+and+the+discussion+starts+on+8%2F12%2F2015+at+4%3A00PM+PDT.%0D%0A%0D%0AThanks%21`, target : '_blank' }).text('Email')
              )
            )
          )
        );

      return panel;
    });
  }
}

export default CountDownView;
