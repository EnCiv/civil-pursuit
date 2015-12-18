'use strict';

import describe                           from 'redtea';
import should                             from 'should';
import User                               from '../../models/user';
import Type                               from '../../models/type';
import signOut                            from '../.test/util/e2e-sign-out';
import identify                           from '../.test/util/e2e-identify';
import reset                              from '../../bin/reset';

function test(props) {
  const locals = {

  };

  return describe('E2E Create item', it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should reset items', () => reset('item'));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Types Group', [ it => {
      it('should create group of types', () => new Promise((ok, ko) => {
        Type.group(
          'e2e create item parent',
          'e2e create item subtype',
          'e2e create item pro',
          'e2e create item con'
        ).then(
          group => {
            locals.group = group;
            ok();
          },
          ko
        );
      }));
    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should go to panel page', () => new Promise((ok, ko) => {
      props.driver.client.isVisible('header[role="banner"].syn-top_bar').then(
        ok,
        error => {
          props.driver.client.url(`http://localhost:${props.port}`).then(ok, ko);
        }
      );
    }));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('identify', describe.use(() => identify(props.driver.client)));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should click create item button', () => props.driver.client.click('#top-level-panel > .syn-panel > .syn-panel-heading .toggle-creator'));

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Invalid form', [ it => {

      it('No subject', [ it => {
        it('should submit form', () => props.driver.client.submitForm('.syn-accordion-wrapper.show > .syn-accordion-content > form[name="creator"]'));

        it('should see error message', () => new Promise((ok, ko) => {
          props.driver.client
            .waitForVisible('.syn-accordion-wrapper.show > .syn-accordion-content > form[name="creator"] .syn-flash--error', 1500).then(
              isVisible => {
                isVisible.should.be.true();
                ok();
              },
              ko
            );
        }));

        it('error message should say "Subject can not be left empty"', () => new Promise((ok, ko) => {
          props.driver.client.getText('.syn-accordion-wrapper.show > .syn-accordion-content > form[name="creator"] .syn-flash--error').then(
            text => {
              text.should.be.exactly('Subject can not be left empty');
              ok();
            },
            ko
          );
        }));
      }]);

      it('No description', [ it => {
        it('should fill subject', () => props.driver.client.setValue('.syn-accordion-wrapper.show > .syn-accordion-content > form[name="creator"] input[name="subject"]', 'Hey there!'));

        it('should submit form', () => props.driver.client.submitForm('.syn-accordion-wrapper.show > .syn-accordion-content > form[name="creator"]'));

        it('should see error message', () => new Promise((ok, ko) => {
          props.driver.client
            .waitForVisible('.syn-accordion-wrapper.show > .syn-accordion-content > form[name="creator"] .syn-flash--error', 1500).then(
              isVisible => {
                isVisible.should.be.true();
                ok();
              },
              ko
            );
        }));

        it('error message should say "Description can not be left empty"', () => new Promise((ok, ko) => {
          props.driver.client.getText('.syn-accordion-wrapper.show > .syn-accordion-content > form[name="creator"] .syn-flash--error').then(
            text => {
              text.should.be.exactly('Description can not be left empty');
              ok();
            },
            ko
          );
        }));
      }]);

    }]);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Leave', [ it => {
      it('test 2', () => {
        const { click } = props.driver.client;
        const is = click.apply(props.driver.client, ['#top-level-panel > .syn-panel > .syn-panel-heading .toggle-creator']);

        console.log(is.constructor.name);
      });

      it('should sign out', describe.use(() => signOut(props.driver.client)));
    }]);



  });
}

export default test;
