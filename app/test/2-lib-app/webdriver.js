'use strict';

import { EventEmitter }     from 'events';
import should               from 'should';
import describe             from 'redtea';
import WebDriver            from '../../lib/app/webdriver';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Web Driver' , [
    {
      'should be a function' : (ok, ko) => {
        WebDriver.should.be.a.Function();
        ok();
      }
    },
    {
      'should be an instance of EventEmitter' : (ok, ko) => {
        locals.driver = new WebDriver();
        locals.driver.should.be.an.instanceof(EventEmitter);
        ok();
      }
    },
    {
      'should emit ready' : (ok, ko) => {
        locals.driver.on('ready', ok).on('error', ko);
      }
    },
    {
      'should end' : (ok, ko) => {
        locals.driver.client.end(error => {
          if ( error ) {
            ko(error);
          }
          else {
            ok();
          }
        });
      }
    }
  ] );

}

export default test;
