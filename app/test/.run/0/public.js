'use strict';

import should               from 'should';
import describe             from 'redtea';
import config               from 'syn/../../public.json';

function test () {

  const locals = {};

  return describe ( 'Public config' , it => {

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('should be an object',

      () => config.should.be.an.Object()

    );

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Profile', it => {

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('should have a property Profile',

        () => config.should.have.property('profile').which.is.an.Object()
      );

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('identity', it => {

        it('should have a property identity',

          () => config.profile
            .should.have.a.property('identity')
            .which.is.an.Object()

        );

        it('should have a property description',

          () => config.profile.identity
            .should.have.property('description')
            .which.is.a.String()

        );

      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('residence', it => {

        it('should have a property residence',

          () => config.profile
            .should.have.a.property('residence')
            .which.is.an.Object()

        );

        it('should have a property description',

          () => config.profile.residence
            .should.have.property('description')
            .which.is.a.String()

        );

        it('should have a property image',

         () => {

           config.profile.residence
            .should.have.property('image')
            .which.is.a.String();

            /https?:\/\//.test(config.profile.residence.image)
              .should.be.true()

          }
        );

      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('demographics', it => {

        it('should have a property demographics',

          () => config.profile
            .should.have.a.property('demographics')
            .which.is.an.Object()

        );

        it('should have a property description',

          () => config.profile.demographics
            .should.have.property('description')
            .which.is.a.String()
        );

        it('should have a property image',

          () => {

            config.profile.demographics
              .should.have.property('image')
              .which.is.a.String();

            /https?:\/\//.test(config.profile.demographics.image)
              .should.be.true();

          }

        );

      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      it('voter', it => {

        it('should have a property voter',

          () => config.profile
            .should.have.a.property('voter')
            .which.is.an.Object()

        );

        it('should have a property description',

          () => config.profile.voter
            .should.have.property('description')
            .which.is.a.String()

        );

        it('should have a property image',

          () => {

            config.profile.voter
              .should.have.property('image')
              .which.is.a.String();

            /https?:\/\//.test(config.profile.voter.image)
              .should.be.true();

          }

        );

      });

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Navigator batch size', it => {

      it('should have a batch size',

        () => config.should.have.property('navigator batch size')
          .which.is.a.Number()

      );

    });


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Default item image', it => {

      it('should have a default item image',

        () => config.should.have.property('default item image')
          .which.is.a.String()
          .and.startWith('http')

      );

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Font awesome CDN', it => {

      it('should have Font Awesome CDN',

        () => config.should.have.property('font awesome')
              .which.is.a.Object()
              .and.have.property('cdn')
              .which.is.a.String()
              .and.startWith('http')
      );

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    it('Evaluated item postion', it => {

      it('should have evaluated item default position',

        () => config
          .should.have.property('evaluation context item position')
          .which.is.a.String()

      );

      it('should be either first or last',

        () => ['first', 'last']
          .indexOf(config['evaluation context item position'])
          .should.be.above(-1)

      );

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  });

}

export default test;
