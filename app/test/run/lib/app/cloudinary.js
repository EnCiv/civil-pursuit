'use strict';

import should               from 'should';
import Cloudinary           from 'cloudinary';
import describe             from 'redtea';
import cloudinary           from '../../../../server/util/cloudinary';

function test () {

  const locals = {};

  return describe ( 'Lib / App / Cloudinary' , it => {

    it('should be an object', () => {
      cloudinary.should.be.an.Object();
    });

    it('should have a config function', () => {
      cloudinary.should.have.property('config')
        .which.is.a.Function();
    });

  });

}

export default test;
