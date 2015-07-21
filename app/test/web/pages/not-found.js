'use strict';

import should         from 'should';
import Milk           from '../../../lib/app/milk';
import config         from '../../../../config.json';
import LayoutTest     from '../components/layout';
import JoinTest       from '../components/join';

class NotFound extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Page not found', options);

    this.options = options;

    this.go('/page/not/found');

    this.actors();

    this.stories();
  }

  actors () {

    this.set('Header', () => this.find('#main h1'));
    this.set('Text', () => this.find('#main p'));

  }

  stories () {

    this

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Page not found'
      })

      .ok(
        () => this.get('Header').text()
          .then(text => text.should.be.exactly('Page not found')),
        'Header should say "Page not found"'
      )

      .ok(
        () => this.get('Text').text()
          .then(text => text.should.be.exactly('We are sorry, your request could not be fulfilled because no relevant results were found.')),
        'Text should say "We are sorry, your request could not be fulfilled because no relevant results were found."'
      )

      .import(JoinTest, { toggled : false, viewport : this.options.viewport })

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Page not found'
      });

  }

}

export default NotFound;
