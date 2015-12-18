'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import superagent             from 'superagent';
import describe               from 'redtea';
import Server                 from '../../server';
import Type                   from '../../models/type';
import Item                   from '../../models/item';
import Config                 from '../../models/config';
import isType                 from '../.test/assertions/is-type';
import isItem                 from '../.test/assertions/is-item';
import isPanelItem            from '../.test/assertions/is-panel-item';
import reset                  from '../../bin/reset';

function test (props = {}) {
  console.log(props);

  if ( ! props.port ) {
    props.port = 13012;
  }

  process.env.PORT = props.port;

  const locals = {};

  return describe ( 'HTTP Server', it => {
    it('reset database', () => new Promise((ok, ko) => {
      reset().then(ok, ko);
    }));

    it('Start', [ it => {
      it('Intro', [ it => {
        it('it should get intro type from DB', () => new Promise((ok, ko) => {
          Type
            .findOne({ name : 'Intro' })
            .then(
              document => {
                locals.introType = document;
                ok();
              },
              ko
            );
        }));

        it('it should get intro item from DB', () => new Promise((ok, ko) => {
          Item
            .findOne({ type : locals.introType })
            .then(
              document => {
                locals.intro = document;
                ok();
              },
              ko
            );
        }));

        it('it should panelify', () => new Promise((ok, ko) => {
          locals.intro
            .toPanelItem()
            .then(
              item => {
                locals.intro = item;
                ok();
              },
              ko
            );
        }));
      }]);

      it('Server', [ it => {
        it('it should start', () => new Promise((ok, ko) => {
          locals.server = new Server({ intro : locals.intro });

          props.server = locals.server;

          locals.server
            .on('error', error => {
              console.log(error);
              ko(error);
            })
            // .on('message', console.log.bind(console, 'message'))
            .on('listening', ok);
        }));
      }]);
    }]);
  });
}

export default test;
