'use strict';

import colors               from 'colors';
import should               from 'should';
import mongodb              from 'mongodb';
import sequencer            from '../../lib/util/sequencer';
import Mung                 from '../../lib/mung';
import User                 from '../../models/user';
import migrate              from '../../bin/migrate';
import encrypt              from '../../lib/util/encrypt';
import Type                 from '../../models/type';
import Race                 from '../../models/race';

describe ( 'Connect' , function () {

  it ( 'should connect' , function (done) {

    try {
      Mung.connect(process.env.MONGO_TEST)
        .on('error', ko)
        .on('connected', () => done());
    }
    catch ( error ) {
      done(error);
    }

  });

});
