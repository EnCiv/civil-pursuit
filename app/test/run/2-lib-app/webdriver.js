'use strict';

import { EventEmitter }     from 'events';
import should               from 'should';
import describe             from 'redtea';
import WebDriver            from 'syn/../../dist/lib/app/webdriver';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Web Driver' , it => {

    it('should be a function', () => {
        WebDriver.should.be.a.Function();
      }
    );

    it('should be an instance of EventEmitter', () => {
        locals.driver = new WebDriver();
        locals.driver.should.be.an.instanceof(EventEmitter);
      }
    );

    it('should emit ready', () => new Promise((ok, ko) => {
        locals.driver.on('ready', ok).on('error', ko);
      })
    );

    it('should end', () => new Promise((ok, ko) => {
        locals.driver.client.end(error => {
          if ( error ) {
            ko(error);
          }
          else {
            ok();
          }
        });
      })
    );

  });

}

export default test;
