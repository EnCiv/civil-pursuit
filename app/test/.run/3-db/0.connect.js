'use strict';

import url                  from 'url';
import should               from 'should';
import Mungo                from 'mungo';
import describe             from 'redtea';

function test (props = {}) {
  const locals = {};

  if ( ! props.mongoUrl ) {
    const dbURL = process.env.MONGODB_URI;

    const parsed = url.parse(dbURL);

    parsed.pathname = '/syn_replaytest';

    props.mongoUrl = url.format(parsed);
  }

  return describe('DB client', it => {
    it(`should connect to ${props.mongoUrl}`, () => new Promise((ok, ko) => {
      Mungo.connect(props.mongoUrl)
        .on('error', ko)
        .on('connected', ok);
    }));

    if ( props.pause ) {
      it(`should pause ${props.pause} milliseconds`, () => new Promise(ok => {
        console.log('Pausing DB client', props.pause);
        setTimeout(() => {
          console.log('bye');
          ok();
        }, props.pause);
      }));
    }
  });
}

export default test;
