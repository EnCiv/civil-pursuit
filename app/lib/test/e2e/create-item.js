'use strict';

import WebDriver            from '../../app/webdriver';
import sequencer            from '../../util/sequencer';
import config               from '../../../../public.json';
import should               from 'should';
import Item                 from '../../../models/item';
import Mungo                from 'mungo';
import isItem               from '../../assertions/item';

const toggler = config.selectors['create top level item toggler'];
const form = config.selectors['creator form'];
const { subject, description, submit } = form;

class CreateItem {

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
    return props.driver.client.url('http://localhost:13012');
  }

  static clickToggle (props) {
    return props.driver.client.click(toggler);
  }

  static setSubject (props) {
    return props.driver.client.setValue(subject, 'Hey! This is a test top level item');
  }

  static setDescription (props) {
    return props.driver.client.setValue(description, 'Hey! This is a test top level item\'s description');
  }

  static submit (props) {
    return props.driver.client.click(submit);
  }

  static findItemDocument (props) {
    return new Promise((ok, ko) => {

      Item.findLastOne().then(
        item => {
          props.item = item;
          try {
            item.should.be.an.item();
          }
          catch ( error ) {
            return ko(error);
          }
          ok();
        },
        ko
      );

    });
  }

  static leave (props) {
    return new Promise((ok, ko) => {

      if ( props.options.end ) {
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

    });
  }

  static run (options = {}) {
    return new Promise((ok, ko) => {
      try {

        const props = { options };

        sequencer([

          this.startDriver,

          this.goHome,

          this.clickToggle,

          props => props.driver.client.pause(1000),

          this.setSubject,

          this.setDescription,

          this.submit,

          this.findItemDocument,

          this.leave


        ], props).then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

}


export default CreateItem;
