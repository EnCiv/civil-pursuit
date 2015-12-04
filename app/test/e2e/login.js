'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from '../../lib/util/describe';
import User                   from '../../models/user';

function test (props) {
  const locals = {};

  return describe ( 'E2E / Login' , [
    {
      'should fetch a random user' : (ok, ko) => {
        User
          .findOneRandom()
          .then(
            user => {
              locals.user = user;
              ok();
            },
            ko
          );
      }
    },
    {
      'should click on sign in button' : (ok, ko) => {
        props.driver.client.click('.syn-top_bar-login_button button').then(ok, ko);
      }
    },
    {
      'wait 1 second' : (ok, ko) => {
        props.driver.client.pause(1000).then(ok, ko);
      }
    },
    {
      'Empty form' : [
        {
          'should submit form' : (ok, ko) => {
            props.driver.client.submitForm('form[name="login"]').then(ok, ko);
          }
        },
        {
          'should have the correct error message' : (ok, ko) => {
            props.driver.client.getText('form[name="login"] .syn-flash--error')
              .then(
                text => {
                  text.should.be.exactly('Email can not be left empty');
                  ok();
                },
                ko
              );
          }
        }
      ]
    },
    {
      'Missing password' : [
        {
          'should fill email' : (ok, ko) => {
            props.driver.client.setValue('form[name="login"] input[name="email"]', 'blahblahblah').then(ok, ko);
          }
        },
        {
          'should submit form' : (ok, ko) => {
            props.driver.client.submitForm('form[name="login"]').then(ok, ko);
          }
        },
        {
          'should have the correct error message' : (ok, ko) => {
            props.driver.client.getText('form[name="login"] .syn-flash--error')
              .then(
                text => {
                  text.should.be.exactly('Password can not be left empty');
                  ok();
                },
                ko
              );
          }
        }
      ]
    },
    {
      'Invalid email' : [
        {
          'should fill password' : (ok, ko) => {
            props.driver.client.setValue('form[name="login"] input[name="password"]', 'blahblahblah').then(ok, ko);
          }
        },
        {
          'should submit form' : (ok, ko) => {
            props.driver.client.submitForm('form[name="login"]').then(ok, ko);
          }
        },
        {
          'should have the correct error message' : (ok, ko) => {
            props.driver.client.getText('form[name="login"] .syn-flash--error')
              .then(
                text => {
                  text.should.be.exactly('Email must be a valid email address');
                  ok();
                },
                ko
              );
          }
        }
      ]
    },
    {
      'No such email' : [
        {
          'should fill email with valid email' : (ok, ko) => {
            props.driver.client.setValue('form[name="login"] input[name="email"]', 'blahblahblah@blahblahblah.com').then(ok, ko);
          }
        },
        {
          'should submit form' : (ok, ko) => {
            props.driver.client.submitForm('form[name="login"]').then(ok, ko);
          }
        },
        {
          'should have the correct error message' : (ok, ko) => {
            props.driver.client.getText('form[name="login"] .syn-flash--error')
              .then(
                text => {
                  text.should.be.exactly('Email not found');
                  ok();
                },
                ko
              );
          }
        }
      ]
    },
    {
      'Wrong password' : [
        {
          'should fill email with existing email' : (ok, ko) => {
            props.driver.client.setValue('form[name="login"] input[name="email"]', locals.user.email).then(ok, ko);
          }
        },
        {
          'should fill password' : (ok, ko) => {
            props.driver.client.setValue('form[name="login"] input[name="password"]', 'blahblahblah').then(ok, ko);
          }
        },
        {
          'should submit form' : (ok, ko) => {
            props.driver.client.submitForm('form[name="login"]').then(ok, ko);
          }
        },
        {
          'should have the correct error message' : (ok, ko) => {
            props.driver.client.getText('form[name="login"] .syn-flash--error')
              .then(
                text => {
                  text.should.be.exactly('Wrong password');
                  ok();
                },
                ko
              );
          }
        }
      ]
    }
  ]);
}

export default test;
