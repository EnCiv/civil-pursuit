'use strict';

import fs             from 'fs';
import should         from 'should';
import marked         from 'marked';
import Milk           from '../../../lib/app/milk';
import config         from '../../../../config.json';
import LayoutTest     from '../components/layout';

class TOSPage extends Milk {

  constructor (props) {
    props = props || {};

    let options = { viewport : props.viewport, vendor : props.vendor };

    super('Terms of Service Page', options);

    this

      .go('/page/terms-of-service')

      .import(LayoutTest, {
        title   :   config.title.prefix + 'Terms of Service'
      })
    ;

    this.actors();

    this.stories();
  }

  actors () {

    this.set('Container', () => this.find('#terms-of-service/container'));

    this.set('Markup', () => new Promise((ok, ko) => {
      let TOS = '';

      fs
        .createReadStream('TOS.md')
        .on('error', error => ko)
        .on('data', data => TOS += data.toString())
        .on('end', () => ok(marked(TOS)));

    }));
  }

  stories () {

    this.ok(
      () => this.get('Container').html()
        .then(html => {

          let markup = /^<div class="gutter" id="terms-of-service\/container">/;
          
          // webdriver bug: sometimes it returns outer HTML instead of inner
          if ( markup.test(html) ) {
            html = html.replace(markup, '').replace(/<\/div>$/, '');
          }

          // Note that some characters changed because of HTML formatting
          let md = this.get('Markup')
            .replace(/\&quot;/g, '"')
            .replace(/\&#39;/g, "'");


          html.should.be.exactly(md);
        })
    );

  }

}

export default TOSPage;
