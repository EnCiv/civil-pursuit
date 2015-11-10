'use strict';

import WebDriver            from '../../app/webdriver';
import sequencer            from '../../util/sequencer';
import config               from '../../../../public.json';
import should               from 'should';
import Item                 from '../../../models/item';
import Mungo                from 'mungo';
import isItem               from '../../assertions/item';
import Join                 from './join';
import Training             from './training';

class CreateItem {
  static context () {
    //
  }

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

  static join (props) {
    return new Promise((ok,ko) => {
      if ( props.options.join === false ) {
        return ok();
      }
      Join.run(props).then(ok, ko);
    });
  }

  static train (props) {
    return new Promise((ok, ko) => {
      if ( props.options.train === false ) {
        return ok();
      }
      Training.doNotShowNextTime(props).then(ok, ko);
    });
  }

  static goHome (props) {
    return props.driver.client.url(`http://localhost:${props.options.port || 3012}`);
  }

  static clickToggle (props) {

    let toggler;

    toggler = '#top-level-panel > .syn-panel > .syn-panel-heading > .toggle-creator';

    return props.driver.client.click(toggler);
  }

  static setSubject (props) {
    let subject;

    subject = '#top-level-panel > .syn-panel > .syn-panel-body > .syn-accordion > .syn-accordion-wrapper > .syn-accordion-content > form[name="creator"] input[name="subject"]';

    return new Promise((ok, ko) => {
      props.driver.client.waitForVisible(subject, 5000).then(
        visible => {
          props.driver.client.setValue(subject, 'Hello').then(ok, ko);
        },
        ko
      );
    });
  }

  static setDescription (props) {
    let description;

    description = '#top-level-panel > .syn-panel > .syn-panel-body > .syn-accordion > .syn-accordion-wrapper > .syn-accordion-content > form[name="creator"] textarea[name="description"]';

    return props.driver.client.setValue(description, 'Hey! This is a test top level item\'s description');
  }

  static submit (props) {
    let submit;

    submit = '#top-level-panel > .syn-panel > .syn-panel-body > .syn-accordion > .syn-accordion-wrapper > .syn-accordion-content > form[name="creator"] [type="submit"]';

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

          this.join,

          this.goHome,

          this.train,

          this.goHome,

          this.clickToggle,

          // props => props.driver.client.pause(2000),

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
