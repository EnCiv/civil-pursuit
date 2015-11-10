'use strict';

import WebDriver from '../../app/webdriver';
import sequencer from '../../util/sequencer';
import generateRandomString from '../../util/random-string';
import config from '../../../../public.json';
import should from 'should';

class Join {

  static startDriver (props) {
    return new Promise((ok, ko) => {

      if ( props.options.driver ) {
        props.driver = props.options.driver;
        return ok();
      }

      else {
        props.driver = new WebDriver();
        props.driver.on('ready', ok);
      }

    });
  }

  static goHome (props) {
    return props.driver.client.url('http://localhost:3012');
  }

  static clickJoinButton (props) {
    return props.driver.client.click(config.selectors['join button']);
  }

  static pause (seconds, props) {
    return props.driver.client.pause(1000 * seconds);
  }

  static fillEmail (props) {
    return new Promise((ok, ko) => {

      if (  props.email ) {
        return props.driver.client
          .setValue(config.selectors['join form']['email'], props.email)
          .then(ok, ko);
      }

      generateRandomString(15)
        .then(
          string => {
            props.email = `${string}@syn-test.com`;
            props.driver.client
              .setValue(config.selectors['join form']['email'], props.email)
              .then(ok, ko);
          },
          ko
        );

    });
  }

  static fillPassword (props) {
    return props.driver.client.setValue(config.selectors['join form']['password'], '1234!!aaBB');
  }

  static fillConfirm (props) {
    return props.driver.client.setValue(config.selectors['join form']['confirm'], '1234!!aaBB');
  }

  static agreeToTerms (props) {
    return props.driver.client.click(config.selectors['join form'].agree);
  }

  static submit (props) {
    return props.driver.client.click(config.selectors['join form'].submit);
  }

  static movedToProfile (props) {
    return new Promise((ok, ko) => {

      props.driver.client.url().then(url => {
        try {
          url.value.should.be.exactly('http://localhost:13012/page/profile');
          ok();
        }
        catch ( error ) {
          ko(error);
        }
      }, ko);

    });
  }

  static hasCookie (props) {
    return new Promise((ok, ko) => {

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

    });
  }

  static run (options = {}) {
    return new Promise((ok, ko) => {
      try {
        const props = { options };

        sequencer([

          this.startDriver,

          this.goHome,

          this.clickJoinButton,

          this.pause.bind(this, 2),

          this.fillEmail,

          this.fillPassword,

          this.fillConfirm,

          this.agreeToTerms,

          this.submit,

          this.pause.bind(this, 2.5),

          this.movedToProfile,

          this.hasCookie,

          props => new Promise((ok, ko) => {

            if ( options.end ) {
              props.driver.client.end(error => {
                if ( error ) {
                  ko(error);
                }
                else {
                  ok();
                }
              });
            }
            else {
              ok();
            }

          })

        ], props).then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

}

export default Join;
