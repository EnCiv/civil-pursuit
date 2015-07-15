'use strict';

import should         from 'should';
import Milk           from '../../../lib/app/milk';
import config         from '../../../../config.json';
import LayoutTest     from '../components/layout';

class SynchronousErrorPage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Error Page (synchronous)', options);

    this

      .go('/error/synchronous')

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Error'
      })
    ;

    this.actors();

    this.stories();
  }

  actors () {

    this.set('Header', () => this.find('#main h1'));
    this.set('Text', () => this.find('#main p'));

  }

  stories () {

    this.ok(
      () => this.get('Header').text()
        .then(text => text.should.be.exactly('Error')),
      'Header should say "Error"'
    );

    this.ok(
      () => this.get('Text').text()
        .then(text => text.should.be.exactly('An error occurred. Please try again in a moment')),
      'Text should say "An error occurred. Please try again in a moment"'
    );

  }

}

export default SynchronousErrorPage;
