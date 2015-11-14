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

      CreateItem.run({ driver : props.driver, type : props.options.type, parent : props.options.parent })
        .then(
          $props => {
            props.item = $props.item;
            ok();
          },
          ko
        );

    });
  }

  static panelifyItem (props) {
    return new Promise((ok, ko) => {
      props.item.toPanelItem().then(
        item => {
          props.panelItem = item;
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

  static countPanels (props) {
    return new Promise((ok, ko) => {
      try {
        props.driver.client.getAttribute('.syn-panel', 'class').then(
          occurrences => {
            try {

              occurrences.should.be.an.Array()
                .and.have.length(props.panelItem.lineage.length + 2);

              ok();
            }
            catch ( error ) {
              ko(error);
            }
          },
          ko
        );
      }
      catch ( error ) {
        ko(error);
      }
    });
  }

  static run (options = {}) {
    return new Promise((ok, ko) => {
      try {

        const props = { options };

        sequencer([

          this.startDriver,

          this.createItem,

          this.panelifyItem,

          this.pause.bind(this, 2.5),

          this.clickOnItemTitle,

          this.pause.bind(this, 1),

          this.urlIsItemPage,

          () => props.driver.client.refresh(),

          this.countPanels,

          this.pause.bind(this, 10),

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
