'use strict';

import WebDriver from '../../app/webdriver';
import sequencer from '../../util/sequencer';
import generateRandomString from '../../util/random-string';
import config from '../../../../public.json';
import should from 'should';

function signUp (options = {}) {
  return new Promise((ok, ko) => {
    try {
      sequencer([

        props => new Promise((ok, ko) => {

          if ( options.driver ) {
            props.driver = options.driver;
            return ok();
          }

          else {
            props.driver = new WebDriver();
            props.driver.on('ready', ok);
          }

        }),

        props => props.driver.client.url('http://localhost:3012'),

        props => props.driver.client.click(config.selectors['join button']),

        props => new Promise((ok, ko) => {

          generateRandomString(15)
            .then(
              string => {
                props.email = `${string}@syn-test.com`;
                ok();
              },
              ko
            );

        }),

        props => props.driver.client.pause(1000 * 2),

        props => props.driver.client.setValue(config.selectors['join form']['email'], props.email),

        props => props.driver.client.setValue(config.selectors['join form']['password'], '1234!!aaBB'),

        props => props.driver.client.setValue(config.selectors['join form']['confirm'], '1234!!aaBB'),

        props => props.driver.client.click(config.selectors['join form'].agree),

        props => props.driver.client.click(config.selectors['join form'].submit),

        props => props.driver.client.pause(1000 * 2.5),

        props => new Promise((ok, ko) => {

          props.driver.client.url().then(url => {
            try {
              url.value.should.be.exactly('http://localhost:3012/page/profile');
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          }, ko);

        }),

        props => new Promise((ok, ko) => {

          props.driver.client.getCookie('synuser').then(cookie => {

            try {
              cookie.should.be.an.Object().and.have.property('value').which.is.a.String();

              const value = JSON.parse(decodeURIComponent(cookie.value).replace(/^j:/, ''));

              value.should.be.an.Object()
                .and.have.property('email').which.is.exactly(props.email.toLowerCase());

              value.should.have.property('id').which.is.a.String();

              ok();
            }
            catch ( error ) {
              ko(error);
            }

          }, ko);

        })

      ]).then(ok, ko);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default signUp;
