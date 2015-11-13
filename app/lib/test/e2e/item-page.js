'use strict';

import WebDriver          from '../../app/webdriver';
import sequencer          from '../../util/sequencer';
import Join               from './join';
import CreateItem         from './create-item';
import Item               from '../../../models/item';
import isItem             from '../../assertions/item';
import config             from '../../../../public.json';

class ItemPage {
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

  static createItem (props) {
    return new Promise((ok, ko) => {

      CreateItem.run({ driver : props.driver })
        .then(
          $props => {
            props.item = $props.item;
            ok();
          },
          ko
        );

    });
  }

  static pause (seconds, props) {
    return props.driver.client.pause(1000 * seconds);
  }

  static clickOnItemTitle (props) {
    return new Promise((ok, ko) => {

      props.driver.client.click(`#item-${props.item._id} h4.item-subject a`).then(ok, ko);

    });
  }

  static urlIsItemPage (props) {
    return new Promise((ok, ko) => {

      props.driver.client.url().then(
        url => {
          try {
            url.should.be.an.Object()
              .and.have.property('value')
              .which.is.a.String()
              .and.endWith(props.item.link);

            ok();
          }
          catch ( error ) {
            ko(error);
          }
        },
        ko
      );

    });
  }

  static run (options = {}) {
    return new Promise((ok, ko) => {
      try {

        const props = { options };

        sequencer([

          this.startDriver,

          this.createItem,

          this.pause.bind(this, 2.5),

          this.clickOnItemTitle,

          this.pause.bind(this, 1),

          this.urlIsItemPage,

          this.pause.bind(this, 30),

          props => props.driver.client.end()

        ], props).then(ok, ko);
      }
      catch ( error ) {
        ko(error);
      }
    });
  }
}

export default ItemPage;
