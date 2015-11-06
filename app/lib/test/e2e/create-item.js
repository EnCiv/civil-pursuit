'use strict';

import WebDriver    from '../../app/webdriver';
import sequencer    from '../../util/sequencer';
import config       from '../../../../public.json';
import should       from 'should';

const toggler = config.selectors['create top level item toggler'];
const form = config.selectors['creator form'];
const { subject, description, submit } = form;

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

        props => props.driver.client.click(toggler),

        props => props.driver.client.pause(1000),

        props => props.driver.client.setValue(subject, 'Hey! This is a test top level item'),

        props => props.driver.client.setValue(description, 'Hey! This is a test top level item\'s description'),

        props => props.driver.client.click(submit)


      ]).then(ok, ko);
    }
    catch ( error ) {
      ko(error);
    }
  });
}

export default signUp;
