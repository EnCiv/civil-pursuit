'use strict';

import fs from 'fs';
import should from 'should';
import marked from 'marked';
import Describe from 'syn/lib/app/Describe';
import config from 'syn/config.json';
import {EventEmitter} from 'events';
import TopBar from '../components/top-bar';
import Footer from '../components/footer';

class TOSPage extends Describe {

  constructor () {
    super('Terms of service page', {
      'web driver'        :   {
        'page'            :   'Terms Of Service'
      }
    });

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
        'document has the right title',
        { document: 'title' },
        title => {
          title.should.be.exactly(config.title.prefix + 'Terms of Service')
        }
      )

      .assert(
        'document\'s encoding is UTF-8',
        { attribute: { charset: 'meta[charset]' } },
        charset => { charset.should.be.exactly('utf-8') })

      .assert(() => new TopBar().driver(this._driver))

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

      .assert(() => new Footer().driver(this._driver))

    ;
  }

}

export default TOSPage;
