'use strict';

import should               from 'should';
import Cloudinary           from 'cloudinary';
import describe             from 'redtea';
import cloudinary           from '../../lib/app/cloudinary';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Cloudinary' , [
    {
      'should be an object' : (ok, ko) => {
        cloudinary.should.be.an.Object();
        ok();
      }
    },
    {
      'should have a config function' : (ok, ko) => {
        cloudinary.should.have.property('config')
          .which.is.a.Function();
        ok();
      }
    }
  ] );

}

export default test;
