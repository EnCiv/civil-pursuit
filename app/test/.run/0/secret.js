'use strict';

import should               from 'should';
import describe             from 'redtea';
import config               from 'syn/../../secret.json';

function test () {

  const locals = {};

  return describe ( 'Secret config' , it => {

    it('should be an object',

      () => config.should.be.an.Object()

    );

    it('should have tmp',

      () => config.should.have.property('tmp').which.is.a.String()

    );

    it('Cloudinary', it => {

      it('should have cloudinary',

        () => config.should.have.property('cloudinary')
            .which.is.an.Object()

      );

      it('should have a cloud name',

        () => config.cloudinary.should.have.property('cloud')
            .which.is.an.Object()
            .and.have.property('name')
            .which.is.a.String()

      );

      it('should have url',

        () => config.cloudinary.should.have.property('url')
            .which.is.a.String()
            .and.startWith('cloudinary://')

      );

      it('API', it => {

        it('should have API',

          () => config.cloudinary.should.have.property('API')
              .which.is.an.Object()

        );

        it('should have key',

          () => config.cloudinary.API.should.have.property('key')
              .which.is.a.String()

        );

        it('should have secret',

          () => config.cloudinary.API.should.have.property('secret')
              .which.is.a.String()
        );

      });

    });

    it('Cookie', it => {

      it('should have a cookie',

        () => config.should.have.property('cookie').which.is.an.Object()

      );

      it('should have path',

        () => config.cookie.should.have.property('path')
            .which.is.a.String()

      );

      it('should have signed',

        () => config.cookie.should.have.property('signed')
            .which.is.a.Boolean()

      );

      it('should have maxAge',

        () => config.cookie.should.have.property('maxAge')
            .which.is.a.Number()

      );

      it('should have httpOnly',

        () => config.cookie.should.have.property('httpOnly')
            .which.is.a.Boolean()
      );

    });

    it('instances', it => {

      it('should be an array',

        () => config.should.have.property('instances').which.is.an.Array()

      );

      it('should be strings',

        () => config.instances.forEach(instance => instance.should.be.a.String())
      );

    });

    it('Facebook', it => {

      it('should have property facebook',

        () => config.should.have.property('facebook')
            .which.is.an.Object()

      );

      it('should have property for each env',

       config.instances.forEach(instance => config.facebook.should.have.property(instance)
            .which.is.an.Object()
          )

      );

      it('should have app id',

        () => config.instances.forEach(instance => config.facebook[instance].should.have.property('app id')
              .which.is.a.String()
          )

      );

      it('should have app secret',

        () => config.instances.forEach(instance => config.facebook[instance].should.have.property('app secret')
              .which.is.a.String()
          )

      );

      it('should have callback url',

        () => config.instances.forEach(instance => config.facebook[instance].should.have.property('callback url')
              .which.is.a.String()
          )
      );

    });

    it('Twitter', it => {

      it('should have property twitter',

        () => config.should.have.property('twitter')
            .which.is.an.Object()

      );

      it('should have property for each env',

        () => config.instances.forEach(instance => config.twitter.should.have.property(instance)
              .which.is.an.Object()
          )

      );

      it('should have key',

        () => config.instances.forEach(instance => config.twitter[instance].should.have.property('key')
              .which.is.a.String()
          )

      );

      it('should have secret',

        () => config.instances.forEach(instance => config.twitter[instance].should.have.property('secret')
              .which.is.a.String()
          )

      );

      it('should have callback url',

        () => config.instances.forEach(instance => config.twitter[instance].should.have.property('callback url')
              .which.is.a.String()
          )
      );

    });

    it('User agent',

      () => config.should.have.property('user agent')
        .which.is.a.String()

    );

    it('Email', it => {

      it('should be an object',

        () => config.should.have.property('email').which.is.an.Object()

      );

      it('should have user',

        () => config.email.should.have.property('user').which.is.a.String()

      );

      it('should have password',

        () => config.email.should.have.property('password').which.is.a.String()
      );

    });

    it('should have forgot password email text',

      () => config
        .should.have.property('forgot password email')
        .which.is.a.String()

    );

    it('should have default user',

      () => config.should.have.property('default user').which.is.a.String()
    );

  });

}

export default test;
