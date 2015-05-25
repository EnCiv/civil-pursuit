'use strict';

import should from 'should';
import Describe from 'beatpoints/lib/app/Describe';
import config from 'syn/config.json';

let describe = new Describe('Web / Sign in Page')
  
  .use('mongoose')

  .use('web driver')

  .define('user', () => Describe.disposableUser())

  .assert('document has the right title', { document: 'title' },
    title => { title.should.be.exactly(config.signIn) }
  )

  .assert('document\'s encoding is UTF-8', { attribute: 'meta[charset]' },
    charset => { charset.should.be.exactly('utf-8') })

  .assert(new TopBar())

  .assert(new SignIn())

  .assert(new Footer());
