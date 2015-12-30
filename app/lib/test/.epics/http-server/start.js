'use strict';

import Mungo                  from 'mungo';
import should                 from 'should';
import Server                 from '../../../server';
import Type                   from '../../../models/type';
import Item                   from '../../../models/item';
import Config                 from '../../../models/config';
import isType                 from '../syn/../../dist/test/assertions/is-type';
import isItem                 from '../syn/../../dist/test/assertions/is-item';
import isPanelItem            from '../syn/../../dist/test/assertions/is-panel-item';
import reset                  from '../../../bin/reset';

const label = 'Start HTTP server';

export default props => describe => describe(label, it => {

  const locals = {};

  if ( ! props.port ) {
    props.port = 13012;
  }

  process.env.PORT = props.port;

  it('Intro', it => {

    it('it should get intro type from DB',

      () => Type

        .findOne({ name : 'Intro' })

        .then(type => { locals.introType = type })

    );

    it('it should get intro item from DB',

      () => Item

        .findOne({ type : locals.introType })

        .then(item => { locals.intro = item })

    );

    it('it should panelify',

      () => locals.intro

        .toPanelItem()

        .then(item => { locals.intro = item })

    );

  });

  it('Server', it => {

    it('it should start',

      () => new Promise((ok, ko) => {
        locals.server = new Server({ intro : locals.intro });

        props.server = locals.server;

        locals.server
          .on('error', error => {
            console.log(error);
            ko(error);
          })
          // .on('message', console.log.bind(console, 'message'))
          .on('listening', ok);
      })

    );

  });

});
