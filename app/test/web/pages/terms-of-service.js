'use strict';

import fs from 'fs';
import should from 'should';
import marked from 'marked';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import Layout from '../components/layout';

class TOSPage extends Describe {

  constructor () {
    super('Terms of service page', {
      'web driver'        :   {
        'page'            :   'Terms Of Service'
      }
    });

    let title = config.title.prefix + 'Terms of Service';

    this

      .before(
        'Get Terms of Service source file',
        () => {
          let TOS = '';

          return new Promise((fulfill, reject) => {
            fs
              .createReadStream('TOS.md')
              .on('error', error => reject)
              .on('data', data => TOS += data.toString())
              .on('end', () => this.define('source', marked(TOS)))
              .on('end', () => fulfill());
          });
        }
      )

      .assert(
        () => new Layout({ title: title }).driver(this._driver)
      )

      .assert(
        'Page has the same content than source',
        { html: '#terms-of-service/container' },
        (html) => {
          // webdriver bug: sometimes it returns outer HTML instead of inner
          if ( /^<div id="terms-of-service\/container">/.test(html) ) {
            html = html.replace(/^<div id="terms-of-service\/container">/, '')
              .replace(/<\/div>$/, '');
          }

          // Note that some characters changed because of HTML formatting
          this._definitions.source = this._definitions.source
            .replace(/\&quot;/g, '"')
            .replace(/\&#39;/g, "'");


          html.should.be.exactly(this._definitions.source);
        }
      )

    ;
  }

}

export default TOSPage;
