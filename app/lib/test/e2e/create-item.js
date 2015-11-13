'use strict';

import should               from 'should';
import Mungo                from 'mungo';
import WebDriver            from '../../app/webdriver';
import makePanelId          from '../../app/make-panel-id';
import sequencer            from '../../util/sequencer';
import isItem               from '../../assertions/item';
import ConfigModel          from '../../../models/config';
import ItemModel            from '../../../models/item';
import TypeModel            from '../../../models/type';
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

  static getType (props) {
    return new Promise((ok, ko) => {
      if ( props.options.type ) {
        TypeModel.findOne({ name : props.options.type }).then(
          type => {
            if  ( ! type ) {
              return ko(new Error('No such type'));
            }
            props.type = type;
            ok();
          },
          ko
        );
      }
      else {
        ConfigModel.get('top level type').then(
          topLevelType => {
            TypeModel.findById(topLevelType).then(
              type => {
                props.type = type;
                ok();
              },
              ko
            );
          },
          ko
        );
      }
    });
  }

  static getParent (props) {
    return new Promise((ok, ko) => {
      if ( props.options.parent ) {
        ItemModel.findById(props.option.parent).then(
          item => {
            if ( ! item ) {
              return ko(new Error('No such parent'));
            }
            props.parent = item;
            ok();
          },
          ko
        );
      }
      else if ( props.type.parent ) {
        ItemModel.findOneRandom({ type : props.type.parent }).then(
          item => {
            if ( ! item ) {
              return ko(new Error('No such parent'));
            }
            props.parent = item;
            ok();
          },
          ko
        );
      }
      else {
        ok();
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
    let url = `http://localhost:${props.options.port || 3012}`;

    return props.driver.client.url(url);
  }

  static goRightPage (props) {
    let url = `http://localhost:${props.options.port || 3012}`;

    if ( props.parent ) {
      url += props.parent.link;
    }

    return props.driver.client.url(url);
  }

  static clickToggle (props) {

    let panelId;

    if ( props.parent ) {
      panelId = makePanelId(props.parent);
    }
    else {
      panelId = makePanelId({ type : props.type });
    }

    const toggler = `.syn-panel-${panelId} > .syn-panel-heading > .toggle-creator`;

    return props.driver.client.click(toggler);
  }

  static setSubject (props) {
    let panelId;

    if ( props.parent ) {
      panelId = makePanelId(props.parent);
    }
    else {
      panelId = makePanelId({ type : props.type });
    }

    const subject = `.syn-panel-${panelId} > .syn-panel-body > .syn-accordion > .syn-accordion-wrapper > .syn-accordion-content > form[name="creator"] input[name="subject"]`;

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
    let panelId;

    if ( props.parent ) {
      panelId = makePanelId(props.parent);
    }
    else {
      panelId = makePanelId({ type : props.type });
    }

    const description = `.syn-panel-${panelId} > .syn-panel-body > .syn-accordion > .syn-accordion-wrapper > .syn-accordion-content > form[name="creator"] textarea[name="description"]`;

    return props.driver.client.setValue(description, 'Hey! This is a test top level item\'s description');
  }

  static submit (props) {
    let panelId;

    if ( props.parent ) {
      panelId = makePanelId(props.parent);
    }
    else {
      panelId = makePanelId({ type : props.type });
    }

    const submit = `.syn-panel-${panelId} > .syn-panel-body > .syn-accordion > .syn-accordion-wrapper > .syn-accordion-content > form[name="creator"] [type="submit"]`;

    return props.driver.client.click(submit);
  }

  static findItemDocument (props) {
    return new Promise((ok, ko) => {

      ItemModel.findLastOne().then(
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

          this.getType,

          this.getParent,

          this.join,

          this.goHome,

          this.train,

          this.goRightPage,

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
