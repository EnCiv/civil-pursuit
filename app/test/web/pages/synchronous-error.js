'use strict';

import should         from 'should';
import Milk           from '../../../lib/app/milk';
import config         from '../../../../config.json';
import LayoutTest     from '../components/layout';
import JoinTest       from '../components/join';

class SynchronousErrorPage extends Milk {

  constructor (props) {
    props = props || {};

    let options = {
      viewport    :   props.viewport,
      vendor      :   props.vendor,
      env         :   props.env || 'production'
    };

    super('Error Page (synchronous)', options);

    this.go('/error/synchronous');

    this.actors();

    this.stories();
  }

  actors () {

    this.set('Header', () => this.find('#main h1'));
    this.set('Text', () => this.find('#main p'));
    this.set('Stack',   () => this.find('#main ul'));

  }

  stories () {

    this

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Error'
      })

      .ok(
        () => this.get('Header').text()
          .then(text => text.should.be.exactly('Error')),
        'Header should say "Error"'
      )

      .ok(
        () => this.get('Text').text()
          .then(text => text.should.be.exactly('An error occurred. Please try again in a moment')),
        'Text should say "An error occurred. Please try again in a moment"',
        () => this.options.env === 'production'
      )

      .ok(
        () => this.get('Stack').is(':visible'),
        'There should be an error stack',
        () => this.options.env === 'development'
      )

      .import(JoinTest, { toggled : false, viewport : this.options.viewport })

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Error'
      });

  }

}

export default SynchronousErrorPage;
