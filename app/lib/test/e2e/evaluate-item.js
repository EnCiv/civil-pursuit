'use strict';

import WebDriver          from '../../app/webdriver';
import sequencer          from '../../util/sequencer';
import join               from './join';
import createItem         from './create-item';
import Item               from '../../../models/item';
import isItem             from '../../assertions/item';
import config             from '../../../../public.json';

class EvaluateItem {
  static startDriver (props) {
    return new Promise((ok, ko) => {

      if ( props.options.__client  && props.options.__client.driver ) {
        props.driver = props.options.__client.driver;
        return ok();
      }

      else {
        props.driver = new WebDriver();
        props.driver.on('ready', ok);
      }

    });
  }

  static join (props) {
    return join({ driver : props.driver, __client });
  }

  static createItem (props) {
    return new Promise((ok, ko) => {

      createItem({ driver : props.driver })
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

  static elementExists (props) {
    return new Promise((ok, ko) => {

      props.driver.client.isExisting(`#item-promote-${props.item._id}`).then(
        exists => {
          try {
            exists.should.be.true;
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

  static verifyCursor (value, props) {
    return new Promise((ok, ko) => {

      props.driver.client.getText(`#item-promote-${props.item._id} .cursor`).then(
        cursor => {
          try {
            cursor.should.be.exactly(value);
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

  static verifyLimit (value, props) {
    return new Promise((ok, ko) => {

      props.driver.client.getText(`#item-promote-${props.item._id} .limit`).then(
        limit => {
          try {
            limit.should.be.exactly(value);
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

  static itemViewHasIncremented (props) {
    return new Promise((ok, ko) => {

      Item.findById(props.item._id).then(
        item => {
          try {
            props.item = item;

            item.should.be.an.item();

            item.views.should.be.exactly(1);

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

          this.join,

          this.createItem,

          this.pause.bind(this, 2.5),

          this.elementExists,

          this.verifyCursor.bind(this, '1'),

          this.verifyLimit.bind(this, '1'),

          this.itemViewHasIncremented,

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

export default EvaluateItem;
