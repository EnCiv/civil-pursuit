'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import describe               from '../../lib/util/describe';
import Join                   from '../../lib/test/e2e/join';

function test(props) {
  const locals = {
    driver : props.driver
  };

  return describe('E2E / Join', [
    {
      'click Join button' : (ok, ko) => {
        Join.clickJoinButton(locals).then(ok, ko);
      }
    },
    {
      'pause 1 second' : (ok, ko) => {
        props.driver.client.pause(1000).then(ok, ko);
      }
    },
    {
      'Empty form' : [
        {
          'submit' : (ok, ko) => {
            Join.submit(locals).then(ok, ko);
          }
        },
        {
          'has error message' : (ok, ko) => {
            Join.hasErrorMessage(locals).then(ok, ko);
          }
        },
        {
          'is correct error message' : (ok, ko) => {
            Join.errorMessage(locals, 'Email can not be left empty').then(ok, ko);
          }
        },
        {
          'fill invalid email' : (ok, ko) => {
            Join.fillEmail(Object.assign(locals, { email : 'blahblahblah' })).then(ok, ko);
          }
        }
      ]
    },
    {
      'Missing password' : [
        {
          'submit' : (ok, ko) => {
            Join.submit(locals).then(ok, ko);
          }
        },
        {
          'has error message' : (ok, ko) => {
            Join.hasErrorMessage(locals).then(ok, ko);
          }
        },
        {
          'is correct error message' : (ok, ko) => {
            Join.errorMessage(locals, 'Password can not be left empty').then(ok, ko);
          }
        },
        {
          'fill password' : (ok, ko) => {
            Join.fillPassword(locals).then(ok, ko);
          }
        }
      ]
    },
    {
      'Missing password confirm' : [
        {
          'submit' : (ok, ko) => {
            Join.submit(locals).then(ok, ko);
          }
        },
        {
          'has error message' : (ok, ko) => {
            Join.hasErrorMessage(locals).then(ok, ko);
          }
        },
        {
          'is correct error message' : (ok, ko) => {
            Join.errorMessage(locals, 'Confirm password can not be left empty').then(ok, ko);
          }
        },
        {
          'fill password confirm' : (ok, ko) => {
            Join.fillConfirm(Object.assign({}, locals, { confirm : 'jjjjj' })).then(ok, ko);
          }
        }
      ]
    },
    {
      'Email is not a valid address' : [
        {
          'submit' : (ok, ko) => {
            Join.submit(locals).then(ok, ko);
          }
        },
        {
          'has error message' : (ok, ko) => {
            Join.hasErrorMessage(locals).then(ok, ko);
          }
        },
        {
          'is correct error message' : (ok, ko) => {
            Join.errorMessage(locals, 'Email must be a valid email address').then(ok, ko);
          }
        },
        {
          'fill email address' : (ok, ko) => {
            locals.email = 'e2e-testuser@synapp.com';

            Join.fillEmail(locals).then(ok, ko);
          }
        }
      ]
    },
    {
      'Passowrds do not match' : [
        {
          'submit' : (ok, ko) => {
            Join.submit(locals).then(ok, ko);
          }
        },
        {
          'has error message' : (ok, ko) => {
            Join.hasErrorMessage(locals).then(ok, ko);
          }
        },
        {
          'is correct error message' : (ok, ko) => {
            Join.errorMessage(locals, 'Passwords do not match').then(ok, ko);
          }
        },
        {
          'fill confirm password' : (ok, ko) => {
            Join.fillConfirm(locals).then(ok, ko);
          }
        }
      ]
    },
    {
      'Missing agree to terms' : [
        {
          'submit' : (ok, ko) => {
            Join.submit(locals).then(ok, ko);
          }
        },
        {
          'has error message' : (ok, ko) => {
            Join.hasErrorMessage(locals).then(ok, ko);
          }
        },
        {
          'is correct error message' : (ok, ko) => {
            Join.errorMessage(locals, 'Please agree to our terms of service').then(ok, ko);
          }
        }
      ]
    },
    {
      'fill email' : (ok, ko) => {
        Join.fillEmail(locals).then(ok, ko);
      }
    },
    {
      'fill password' : (ok, ko) => {
        Join.fillPassword(locals).then(ok, ko);
      }
    },
    {
      'confirm password' : (ok, ko) => {
        Join.fillConfirm(locals).then(ok, ko);
      }
    },
    {
      'agree to terms' : (ok, ko) => {
        Join.agreeToTerms(locals).then(ok, ko);
      }
    },
    {
      'submit' : (ok, ko) => {
        Join.submit(locals).then(ok, ko);
      }
    }
  ]);
}

export default test;
